#!/bin/bash
# BaoPixel Studio - Quick Start (macOS/Linux)
# Exécutez avec: bash start-dev.sh

echo ""
echo "🎬 BaoPixel Studio - Local Development Setup"
echo "=============================================="
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) found"
echo "✅ npm $(npm --version) found"
echo ""

# Installer les dépendances
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "🚀 Starting development server..."
echo "🌐 Open: http://localhost:3000"
echo "📝 Press Ctrl+C to stop"
echo ""

npm run dev
