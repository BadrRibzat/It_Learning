import json
from bson import ObjectId
from pymongo import MongoClient
from utils.exceptions import AppError
from config import config

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)

class Database:
    _instance = None
    _client = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            try:
                cls._client = MongoClient(config.MONGODB_URI)
                cls._db = cls._client['e-learn']
            except Exception as e:
                raise AppError(f"Database connection failed: {e}", 500)
        return cls._instance

    def get_db(self):
        return self._db

def get_db():
    return Database().get_db()

def init_db():
    db = get_db()
    # Create unique email index if not exists
    if "email_1" not in db.users.index_information():
        db.users.create_index([("email", 1)], unique=True, background=True)

def close_db_connection(client):
    client.close()
