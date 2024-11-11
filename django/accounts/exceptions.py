from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    """
    Custom exception handler for more detailed error responses
    """
    # Call the default exception handler first
    response = exception_handler(exc, context)

    # If response is None, it means the exception wasn't handled by DRF
    if response is None:
        return response

    # Custom error handling
    error_details = {
        'error': 'An unexpected error occurred',
        'details': str(exc)
    }

    # Customize based on exception type
    if isinstance(exc, serializers.ValidationError):
        error_details = {
            'error': 'Validation failed',
            'details': exc.detail
        }
        response.status_code = status.HTTP_400_BAD_REQUEST

    # Update the response data
    response.data = error_details

    return response
