import os
from pymongo import MongoClient, errors
from utils.exceptions import AppError
import logging
from config import config
import dns.resolver

logger = logging.getLogger(__name__)

class Database:
    _instance = None
    _client = None
    _db = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            try:
                # For testing environment
                if os.getenv('TESTING'):
                    from mongomock import MongoClient as MockMongoClient
                    cls._client = MockMongoClient()
                    cls._db = cls._client.test_db
                    logger.info("Using mock database for testing")
                    return cls._instance

                # Production connection with DNS settings
                dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
                dns.resolver.default_resolver.nameservers = ['8.8.8.8', '8.8.4.4']

                # MongoDB Atlas connection
                cls._client = MongoClient(
                    config.MONGODB_URI,
                    serverSelectionTimeoutMS=5000,
                    connectTimeoutMS=10000,
                    socketTimeoutMS=45000,
                    maxPoolSize=50,
                    retryWrites=True,
                    ssl=True,
                    tls=True,
                    tlsAllowInvalidCertificates=True
                )
                
                # Get the database name from the URI or use default
                db_name = config.MONGODB_URI.split('/')[-1].split('?')[0] or 'e-learn'
                cls._db = cls._client[db_name]
                
                # Test connection
                cls._client.admin.command('ping')
                logger.info("Successfully connected to MongoDB Atlas")
                
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
