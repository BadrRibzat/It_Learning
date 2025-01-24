import redis
from functools import wraps
from config import config
import logging
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Single Redis client instance
redis_client = None

try:
    redis_client = redis.Redis(
        host=config.REDIS_HOST,
        port=config.REDIS_PORT,
        decode_responses=True,
        socket_connect_timeout=1
    )
    redis_client.ping()
except (redis.ConnectionError, redis.exceptions.ConnectionError):
    logger.warning("Redis connection failed. Running without cache.")

def cache(ttl: int = 300):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if not redis_client:
                return func(*args, **kwargs)

            key = f"{func.__name__}:{str(args)}:{str(kwargs)}"
            try:
                cached = redis_client.get(key)
                if cached:
                    return json.loads(cached)
                result = func(*args, **kwargs)
                redis_client.setex(key, ttl, json.dumps(result))
                return result
            except Exception as e:
                logger.error(f"Cache error: {e}")
                return func(*args, **kwargs)
        return wrapper
    return decorator
