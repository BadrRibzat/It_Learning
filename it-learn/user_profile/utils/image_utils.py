import os
from PIL import Image
import io
import base64
from datetime import datetime, UTC
from utils.exceptions import AppError
import logging

logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
MAX_DIMENSION = 800

def allowed_file(filename):
    """Check if file has an allowed extension"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_image(file, save_path):
    """Process and optimize uploaded image"""
    try:
        # Ensure file pointer is at start
        file.seek(0)
        
        # Read image data
        image = Image.open(file)
        
        # Convert to RGB if needed
        if image.mode not in ('RGB', 'RGBA'):
            image = image.convert('RGB')
        
        # Resize if necessary
        width, height = image.size
        if width > MAX_DIMENSION or height > MAX_DIMENSION:
            ratio = min(MAX_DIMENSION/width, MAX_DIMENSION/height)
            new_size = (int(width * ratio), int(height * ratio))
            image = image.resize(new_size, Image.LANCZOS)
        
        # Save optimized image to file system
        image.save(save_path, 'PNG', optimize=True)
        
        # Create base64 representation
        output = io.BytesIO()
        image.save(output, format='PNG', optimize=True)
        output.seek(0)
        
        # Convert to base64 for response
        return base64.b64encode(output.getvalue()).decode()
        
    except Exception as e:
        logger.error(f"Image processing error: {str(e)}")
        raise AppError(f"Failed to process image: {str(e)}", 400)

def validate_file(file):
    """Validate uploaded file"""
    if not file:
        raise AppError("No file provided", 400)
    
    if not file.filename:
        raise AppError("No filename provided", 400)
    
    if not allowed_file(file.filename):
        raise AppError(
            f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}", 
            400
        )
    
    try:
        file.seek(0, os.SEEK_END)
        size = file.tell()
        file.seek(0)
        if size > MAX_FILE_SIZE:
            raise AppError(f"File too large. Maximum size: {MAX_FILE_SIZE/1024/1024}MB", 400)
    except (AttributeError, IOError) as e:
        logger.error(f"File validation error: {str(e)}")
        raise AppError("Invalid file", 400)
