#!/bin/bash
# RustRCON - Quick Start Script
# Installs dependencies and launches the dashboard

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="${PORT:-3001}"

echo ""
echo "  🎮  RustRCON Dashboard"
echo "  ────────────────────────"
echo ""

# Check for Node.js
if ! command -v node &>/dev/null; then
    echo "  ❌  Node.js is not installed."
    echo "     Install it from https://nodejs.org (v14+)"
    echo ""
    exit 1
fi

NODE_VER=$(node -v)
echo "  ✅  Node.js $NODE_VER detected"

# Install dependencies
cd "$SCRIPT_DIR/backend"
if [ ! -d "node_modules" ]; then
    echo "  📦  Installing dependencies..."
    npm install --silent
else
    echo "  ✅  Dependencies already installed"
fi

# Check if port is already in use
if lsof -ti:$PORT &>/dev/null; then
    echo "  ⚠️   Port $PORT is already in use."
    read -r -p "  Kill the existing process and continue? [Y/n] " answer
    answer=${answer:-Y}
    if [[ "$answer" =~ ^[Yy]$ ]]; then
        lsof -ti:$PORT | xargs kill -9 2>/dev/null
        sleep 1
        echo "  ✅  Cleared port $PORT"
    else
        echo "  💡  Use a different port: PORT=3002 ./start.sh"
        exit 1
    fi
fi

# Launch
echo ""
echo "  🚀  Starting server on port $PORT..."
echo "  🌐  Open http://localhost:$PORT in your browser"
echo "  ⏹   Press Ctrl+C to stop"
echo ""

PORT=$PORT node index.js
