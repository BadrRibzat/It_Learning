from flask import Flask, jsonify, request
from json import JSONEncoder
from flask_jwt_extended import JWTManager
from flask_jwt_extended.exceptions import RevokedTokenError, JWTExtendedException
from flask_cors import CORS
from flask_restx import Api
from config import config
from services.ml_service import MLContentService
from utils.exceptions import AppError
from bson import ObjectId
from utils.db import init_db, get_db, mongo_healthcheck
from utils.redis_cache import redis_healthcheck
from werkzeug.exceptions import HTTPException
import warnings
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

warnings.filterwarnings("ignore", category=DeprecationWarning, module="jsonschema")
warnings.filterwarnings("ignore", category=DeprecationWarning, module="flask_restx")

def create_app():
    app = Flask(__name__)
    app.config.from_object(config)
    app.json_encoder = CustomJSONEncoder
    
    # Set JWT configurations
    app.config.update(
        JWT_ERROR_MESSAGE_KEY='error',
        JWT_BLACKLIST_ENABLED=True,
        JWT_BLACKLIST_TOKEN_CHECKS=['access'],
        PROPAGATE_EXCEPTIONS=True
    )

    # Initialize database
    with app.app_context():
        try:
            init_db()
            logger.info("Database initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize database: {e}")
            raise

    # Initialize JWT
    jwt = JWTManager(app)

    @app.before_request
    def check_auth():
        # Skip auth check for options requests and non-api endpoints
        if request.method == 'OPTIONS':
            return None

        # Skip auth for login, register, and healthcheck endpoints
        public_endpoints = ['login', 'register', 'healthcheck', 'swagger', 'docs']
        if request.endpoint and any(ep in request.endpoint for ep in public_endpoints):
            return None

        # Check if endpoint requires auth
        view_func = app.view_functions.get(request.endpoint)
        if view_func and hasattr(view_func, 'view_class'):
            auth_required = any(
                hasattr(getattr(view_func.view_class, method), '_jwt_required')
                for method in ['get', 'post', 'put', 'delete']
                if hasattr(view_func.view_class, method)
            )
            
            if auth_required and 'Authorization' not in request.headers:
                return jsonify({
                    'error': 'Authorization required',
                    'message': 'Missing authorization header'
                }), 401

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        try:
            db = get_db()
            jti = jwt_payload["jti"]
            token = db.revoked_tokens.find_one({"jti": jti})
            return token is not None
        except Exception as e:
            logger.error(f"Token check failed: {e}")
            return True

    @jwt.revoked_token_loader
    def handle_revoked_token(jwt_header, jwt_payload):
        return jsonify({
            "error": "Token has been revoked",
            "message": "Your session has expired, please login again"
        }), 401

    @jwt.invalid_token_loader
    def handle_invalid_token(error_string):
        return jsonify({
            "error": "Invalid token",
            "message": str(error_string)
        }), 401

    @jwt.expired_token_loader
    def handle_expired_token(jwt_header, jwt_payload):
        return jsonify({
            "error": "Token has expired",
            "message": "Your token has expired, please login again"
        }), 401

    @jwt.unauthorized_loader
    def handle_missing_token(error_string):
        return jsonify({
            "error": "Authorization required",
            "message": "Token is missing"
        }), 401

    # Register error handlers
    @app.errorhandler(RevokedTokenError)
    def handle_revoked_token_error(error):
        return jsonify({
            "error": "Authentication error",
            "message": "Token has been revoked"
        }), 401

    @app.errorhandler(JWTExtendedException)
    def handle_jwt_error(error):
        return jsonify({
            "error": "Authentication error",
            "message": str(error)
        }), 401

    @app.errorhandler(HTTPException)
    def handle_http_error(error):
        return jsonify({
            "error": error.name,
            "message": error.description
        }), error.code

    @app.errorhandler(AppError)
    def handle_app_error(error):
        return jsonify({
            "error": error.message
        }), error.status_code

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        logger.error(f"Unexpected error: {str(error)}")
        if isinstance(error, (RevokedTokenError, JWTExtendedException)):
            return handle_jwt_error(error)
        return jsonify({
            "error": "Internal server error",
            "message": "An unexpected error occurred"
        }), 500

    # Configure CORS
    CORS(app, 
        resources={r"/*": {"origins": config.CORS_ORIGINS.split(","), 
                          "methods": ["GET", "POST", "PUT", "DELETE"],
                          "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
                          "supports_credentials": True}}
    )

    # Import namespaces here to avoid circular imports
    from authentication.routes import auth_ns
    from user_profile import profile_ns
    from chatbot.routes import chatbot_ns
    from lessons.routes import lessons_ns

    api = Api(
        app,
        version="1.0",
        title="Command Line Learning API",
        description="Interactive API for learning Linux/MacOS commands through an engaging learning platform with flashcards, quizzes, and a smart chatbot assistant",
        doc="/docs/",
        authorizations={
            'Bearer Auth': {
                'type': 'apiKey',
                'in': 'header',
                'name': 'Authorization',
                'description': "Type in the *'Value'* input box below: **'Bearer &lt;JWT&gt;'**, where JWT is the token"
            },
        }
    )

    # Register namespaces
    api.add_namespace(auth_ns)
    api.add_namespace(profile_ns)
    api.add_namespace(chatbot_ns)
    api.add_namespace(lessons_ns)
    
    # Add healthcheck endpoint
    @app.route('/healthcheck')
    def health_check():
        try:
            services_status = {
                'redis': redis_healthcheck(),
                'mongodb': mongo_healthcheck(),
                'application': 'running',
                'status': 'healthy'
            }
        
            is_healthy = all(
                status for key, status in services_status.items() 
                if key != 'status'
            )
            services_status['status'] = 'healthy' if is_healthy else 'unhealthy'
        
            status_code = 200 if is_healthy else 503
            logger.info(f"Health check: {services_status}")
        
            return jsonify(services_status), status_code
        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            return jsonify({
                'status': 'unhealthy',
                'error': str(e)
            }), 503

    # Initialize ML service
    try:
        MLContentService()
        logger.info("ML service initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize ML service: {e}")
        raise

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=config.DEBUG)

