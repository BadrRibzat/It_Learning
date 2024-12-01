from functools import wraps
from django.core.cache import cache
from django.conf import settings
from django.utils.encoding import force_bytes
from hashlib import md5

def cache_response(timeout=None, key_prefix='', cache_errors=False):
    """
    Cache the response of a view for a specified time.
    """
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            # Generate cache key
            cache_key = _generate_cache_key(
                view_func.__name__,
                key_prefix,
                request,
                args,
                kwargs
            )

            # Try to get response from cache
            response = cache.get(cache_key)
            if response is not None:
                return response

            # Generate response
            response = view_func(request, *args, **kwargs)

            # Cache response if successful or if cache_errors is True
            if response.status_code == 200 or cache_errors:
                cache_timeout = timeout or settings.CACHE_TTL
                cache.set(cache_key, response, cache_timeout)

            return response
        return _wrapped_view
    return decorator

def _generate_cache_key(view_name, key_prefix, request, args, kwargs):
    """
    Generate a unique cache key based on the view name, prefix, request path,
    and query parameters.
    """
    # Start with the view name and prefix
    key_parts = [key_prefix, view_name]

    # Add request path
    key_parts.append(request.path)

    # Add query parameters
    if request.GET:
        key_parts.append(request.GET.urlencode())

    # Add user ID if authenticated
    if request.user.is_authenticated:
        key_parts.append(str(request.user.id))

    # Join parts and create MD5 hash
    key_string = ':'.join(key_parts)
    return md5(force_bytes(key_string)).hexdigest()

def cache_page_for_user(timeout=None):
    """
    Cache a view's response per user for a specified time.
    """
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return view_func(request, *args, **kwargs)

            cache_key = f'user_page_{request.user.id}_{request.path}'
            response = cache.get(cache_key)

            if response is None:
                response = view_func(request, *args, **kwargs)
                cache_timeout = timeout or settings.CACHE_TTL
                cache.set(cache_key, response, cache_timeout)

            return response
        return _wrapped_view
    return decorator
