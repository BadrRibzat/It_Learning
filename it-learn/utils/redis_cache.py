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

try:
    # Get configuration from config object
    redis_host = config.REDIS_HOST
    redis_port = config.REDIS_PORT
    redis_password = config.REDIS_PASSWORD
    
    logger.info(f"Attempting to connect to Redis at {redis_host}:{redis_port}")
    logger.info(f"Redis password is {'set' if redis_password else 'not set'}")
    
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
    
    retry_strategy = Retry(
        ExponentialBackoff(cap=10, base=1),
        retries=3
    )
    
    redis_client = redis.Redis(
        connection_pool=redis_pool,
        retry=retry_strategy,
        decode_responses=True
    )
    
    # Test connection with explicit logging
    if redis_client.ping():
        logger.info("Successfully connected to Redis")
    else:
        raise redis.ConnectionError("Redis connection failed")

except (redis.ConnectionError, redis.AuthenticationError) as e:
    logger.error(f"Redis connection error: {str(e)}")
    redis_client = None
except Exception as e:
    logger.error(f"Unexpected Redis error: {str(e)}")
    redis_client = None

def cache(ttl: int = 300, retries: int = 2):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if not redis_client:
                return func(*args, **kwargs)

            # Create a unique cache key
            key = f"{func.__module__}:{func.__name__}:{str(args)}:{str(kwargs)}"
            
            for attempt in range(retries + 1):
                try:
                    # Try to get cached value
                    cached = redis_client.get(key)
                    if cached:
                        return json.loads(cached)
                        
                    # If no cached value, execute function
                    result = func(*args, **kwargs)
                    
                    # Cache the result
                    redis_client.setex(
                        name=key,
                        time=timedelta(seconds=ttl),
                        value=json.dumps(result)
                    )
                    return result
                
                except (redis.ConnectionError, redis.TimeoutError) as e:
                    if attempt == retries:
                        logger.warning(f"Cache operation failed after {retries} attempts: {str(e)}")
                        return func(*args, **kwargs)
                    logger.warning(f"Cache retry {attempt + 1}/{retries}")
                    
                except Exception as e:
                    logger.error(f"Cache error: {str(e)}")
                    return func(*args, **kwargs)
            
            return func(*args, **kwargs)
        return wrapper
    return decorator

def redis_healthcheck():
    """Check if Redis is available and responding"""
    if not redis_client:
        return False
    try:
        return redis_client.ping()
    except redis.RedisError:
        return False
