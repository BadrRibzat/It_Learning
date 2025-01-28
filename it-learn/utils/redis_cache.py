import os
import redis
from redis.retry import Retry
from redis.backoff import ExponentialBackoff
from functools import wraps
import logging
import json
from datetime import timedelta
from config import config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Redis connection pool
redis_pool = None
redis_client = None

def get_redis_client():
    global redis_client
    if redis_client:
        return redis_client
        
    try:
        # Get configuration from config object
        redis_host = config.REDIS_HOST
        redis_port = config.REDIS_PORT
        redis_password = config.REDIS_PASSWORD
        
        logger.info(f"Attempting to connect to Redis at {redis_host}:{redis_port}")
        
        # Connection configuration
        redis_pool = redis.ConnectionPool(
            host=redis_host,
            port=redis_port,
            password=redis_password,
            decode_responses=True,
            max_connections=50,
            socket_connect_timeout=2,
            socket_keepalive=True,
            retry_on_timeout=True,
            health_check_interval=30
        )
        
        redis_client = redis.Redis(
            connection_pool=redis_pool,
            decode_responses=True
        )
        
        # Test connection
        redis_client.ping()
        logger.info("Successfully connected to Redis")
        return redis_client

    except Exception as e:
        logger.warning(f"Redis not available: {str(e)}. Running without cache.")
        return None

def cache(ttl: int = 300):
    """Decorator that will attempt to use Redis cache if available, otherwise just execute the function"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            client = get_redis_client()
            if not client:
                return func(*args, **kwargs)

            try:
                # Create cache key
                key = f"{func.__module__}:{func.__name__}:{str(args)}:{str(kwargs)}"
                
                # Try to get cached value
                cached = client.get(key)
                if cached:
                    return json.loads(cached)
                    
                # Execute function and cache result
                result = func(*args, **kwargs)
                client.setex(
                    name=key,
                    time=timedelta(seconds=ttl),
                    value=json.dumps(result)
                )
                return result
                
            except Exception as e:
                logger.warning(f"Cache operation failed: {str(e)}")
                return func(*args, **kwargs)
                
        return wrapper
    return decorator

def redis_healthcheck():
    """Check if Redis is available and responding"""
    client = get_redis_client()
    if not client:
        return False
    try:
        return client.ping()
    except:
        return False
