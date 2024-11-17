from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    logger.error(f"Unhandled Exception: {exc}")
    logger.error(f"Context: {context}")

    if response is None:
        return Response({
            'error': 'An unexpected error occurred',
            'detail': str(exc)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if response.status_code == 401:
        response.data = {
            'error': 'Authentication failed',
            'detail': 'Invalid or expired authentication token'
        }

    if response.status_code == 403:
        response.data = {
            'error': 'Permission denied',
            'detail': 'You do not have permission to perform this action'
        }

    if response.status_code == 404:
        response.data = {
            'error': 'Resource not found',
            'detail': response.data.get('detail', 'The requested resource could not be found')
        }

    return response
