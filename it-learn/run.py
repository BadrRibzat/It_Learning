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
from utils.db import init_db, get_db  # Added missing imports

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
        init_db()

    jwt = JWTManager(app)

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        db = get_db()
        jti = jwt_payload["jti"]
        token = db.revoked_tokens.find_one({"jti": jti})
        return token is not None

    # Configure CORS
    CORS(app, resources={r"/*": {"origins": config.FRONTEND_URL}}, supports_credentials=True)

    # Initialize API documentation
    api = Api(
        app,
        version="1.0",
        title="Learn English API",
        description="API for learning English through flashcards and quizzes",
        doc="/docs/"
    )

    # Register namespaces
    api.add_namespace(auth_ns)
    api.add_namespace(profile_ns)
    api.add_namespace(chatbot_ns)
    api.add_namespace(lessons_ns)

    # Centralized error handling
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
        return jsonify({"error": "Internal server error", "message": str(error)}), 500

    @app.errorhandler(AppError)
    def handle_app_error(error):
        return jsonify({"error": error.message}), error.status_code

    # Initialize the ML service
    MLContentService()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=config.DEBUG)
