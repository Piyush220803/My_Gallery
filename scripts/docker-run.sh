#!/bin/bash

# Docker run script for My Gallery app

echo "🚀 Starting My Gallery app in Docker..."

# Check if image exists
if ! docker image inspect mygallery-app:latest > /dev/null 2>&1; then
    echo "📦 Image not found. Building first..."
    ./scripts/docker-build.sh
fi

# Run the container
docker run -d \
    --name mygallery-container \
    -p 8081:8081 \
    -p 19000:19000 \
    -p 19001:19001 \
    -p 19002:19002 \
    mygallery-app:latest

if [ $? -eq 0 ]; then
    echo "✅ My Gallery app is running!"
    echo ""
    echo "🌐 Access your app at:"
    echo "   - Web: http://localhost:8081"
    echo "   - Expo DevTools: http://localhost:19002"
    echo ""
    echo "📱 To view logs:"
    echo "   docker logs -f mygallery-container"
    echo ""
    echo "🛑 To stop:"
    echo "   docker stop mygallery-container"
    echo "   docker rm mygallery-container"
else
    echo "❌ Failed to start container!"
    exit 1
fi
