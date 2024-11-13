from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status, serializers
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    # Log the error
    logger.error(f"Unhandled Exception: {exc}")
    logger.error(f"Context: {context}")

    # If response is None, handle generic exceptions
    if response is None:
        return Response({
            'error': 'An unexpected error occurred',
            'detail': str(exc)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response

