# Build stage
FROM python:3.12-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_sm

# Final stage
FROM python:3.12-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Python packages from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages/ /usr/local/lib/python3.12/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/

# Create non-root user
RUN useradd -m appuser && \
    mkdir -p /home/appuser/.local/bin && \
    chown -R appuser:appuser /home/appuser

# Set environment variables
ENV HOME=/home/appuser \
    PATH=/home/appuser/.local/bin:$PATH \
    PYTHONPATH=/app \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Copy application code
COPY --chown=appuser:appuser . .

USER appuser

EXPOSE 5000

# Render uses dynamic ports
ENV PORT=10000
EXPOSE ${PORT}

# Update the CMD to use PORT environment variable
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT} --worker-class sync --workers 4 --timeout 120 --access-logfile - --error-logfile - 'run:create_app()'"]
