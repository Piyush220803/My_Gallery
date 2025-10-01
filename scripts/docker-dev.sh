#!/bin/bash

# Docker development script for My Gallery app

echo "🔧 Starting My Gallery development environment..."

# Stop and remove existing containers
docker-compose -f docker-compose.dev.yml down

# Build and start development environment
docker-compose -f docker-compose.dev.yml up --build

echo "✅ Development environment started!"
echo ""
echo "🌐 Access your app at:"
echo "   - Web: http://localhost:8081"
echo "   - Expo DevTools: http://localhost:19002"
echo ""
echo "📱 To view logs:"
echo "   docker-compose -f docker-compose.dev.yml logs -f"
echo ""
echo "🛑 To stop:"
echo "   docker-compose -f docker-compose.dev.yml down"
