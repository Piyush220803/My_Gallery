#!/bin/bash

# Docker build script for My Gallery app

echo "🐳 Building My Gallery Docker image..."

# Build the Docker image
docker build -t mygallery-app:latest .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo "📦 Image: mygallery-app:latest"
    echo ""
    echo "🚀 To run the container:"
    echo "   docker run -p 8081:8081 mygallery-app:latest"
    echo ""
    echo "🐳 Or use docker-compose:"
    echo "   docker-compose up"
else
    echo "❌ Docker build failed!"
    exit 1
fi
