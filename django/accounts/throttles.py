from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from django.core.cache import cache

class LoginAttemptThrottle(AnonRateThrottle):
    """
    Limit the rate of login attempts from an IP address
    """
    scope = 'login'

    def allow_request(self, request, view):
        # Get client IP
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')

        # Create a unique cache key
        cache_key = f'login_attempts_{ip}'
        
        # Get current attempt count
        attempts = cache.get(cache_key, 0)
        
        if attempts >= 5:
            return False
        
        # Increment attempts
        cache.set(cache_key, attempts + 1, 300)
        
        return super().allow_request(request, view)

class LoginUserRateThrottle(UserRateThrottle):
    """
    Limit login attempts for authenticated users
    """
    scope = 'login_user'
