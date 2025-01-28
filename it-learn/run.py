from flask import Flask, jsonify
from json import JSONEncoder
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_restx import Api
from config import config
from authentication.routes import auth_ns
from user_profile.profile_routes import profile_ns
from chatbot.routes import chatbot_ns
from lessons.routes import lessons_ns
from services.ml_service import MLContentService
from utils.exceptions import AppError
from bson import ObjectId
from utils.db import init_db, get_db, mongo_healthcheck
from utils.redis_cache import redis_healthcheck

import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

def create_app():
    app = Flask(__name__)
    app.config.from_object(config)
    app.json_encoder = CustomJSONEncoder

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

    # Configure CORS
    CORS(app, 
     resources={r"/*": {"origins": config.CORS_ORIGINS.split(","), 
                       "methods": ["GET", "POST", "PUT", "DELETE"],
                       "allow_headers": ["Content-Type", "Authorization"]}},
     supports_credentials=True)

    # Initialize API documentation
    api = Api(
        app,
        version="1.0",
        title="Learn English API",
        description="API for learning English through flashcards and quizzes",
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
        services_status = {
            'redis': redis_healthcheck(),
            'mongodb': mongo_healthcheck(),
            'status': 'healthy'
        }
        
        is_healthy = all(services_status.values())
        services_status['status'] = 'healthy' if is_healthy else 'unhealthy'
        
        return jsonify(services_status), 200 if is_healthy else 503

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        logger.error(f"Unexpected error: {str(error)}")
        return jsonify({
            "error": "Internal server error",
            "message": "An unexpected error occurred"
        }), 500
    
    # Error handlers
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"error": "Bad request", "message": str(error)}), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found", "message": str(error)}), 404

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({"error": "Forbidden", "message": str(error)}), 403

    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal server error: {error}")
        return jsonify({"error": "Internal server error", "message": str(error)}), 500

    @app.errorhandler(AppError)
    def handle_app_error(error):
        return jsonify({"error": error.message}), error.status_code

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
