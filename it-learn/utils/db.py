import json
from bson import ObjectId
from pymongo import MongoClient, errors
from utils.exceptions import AppError
from config import config
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)

class Database:
    _instance = None
    _client = None
    _db = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            try:
                # Configure MongoDB client with proper settings
                cls._client = MongoClient(
                    config.MONGODB_URI,
                    serverSelectionTimeoutMS=5000,
                    connectTimeoutMS=10000,
                    socketTimeoutMS=45000,
                    maxPoolSize=50,
                    retryWrites=True
                )
                cls._db = cls._client['e-learn']
                
                # Test connection
                cls._client.admin.command('ping')
                logger.info("Successfully connected to MongoDB")
                
            except errors.ConnectionFailure as e:
                logger.error(f"MongoDB connection failed: {e}")
                raise AppError(f"Database connection failed: {e}", 500)
            except Exception as e:
                logger.error(f"Unexpected database error: {e}")
                raise AppError(f"Database error: {e}", 500)
        return cls._instance

    def get_db(self):
        return self._db

    @classmethod
    def close(cls):
        if cls._client:
            cls._client.close()
            cls._client = None
            cls._db = None
            cls._instance = None

def get_db():
    """Get database instance"""
    return Database().get_db()

def init_db():
    """Initialize database with required indexes"""
    try:
        db = get_db()
        # Create indexes
        indexes = [
            ("users", [("email", 1)], {"unique": True}),
            ("revoked_tokens", [("jti", 1)], {"unique": True}),
            ("lessons", [("level", 1)], {}),
        ]
        
        for collection, index_fields, options in indexes:
            if f"{index_fields[0][0]}_{index_fields[0][1]}" not in db[collection].index_information():
                db[collection].create_index(index_fields, **options)
                logger.info(f"Created index for {collection}: {index_fields}")
                
        logger.info("Database initialization completed successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise AppError(f"Database initialization failed: {e}", 500)

def mongo_healthcheck():
    """Check if MongoDB is available and responding"""
    try:
        db = get_db()
        return db.command('ping')['ok'] == 1.0
    except Exception as e:
        logger.error(f"MongoDB health check failed: {e}")
        return False
