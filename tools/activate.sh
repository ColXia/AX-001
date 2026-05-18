#!/bin/bash
# AX-001 Project Environment Setup Script

# Set project root
export AX001_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]// Provider-specific function removed")" && pwd)"

# Add project-local npm binaries to PATH
export PATH="$AX001_ROOT/node_modules/.bin:$AX001_ROOT/.npm-global/bin:$PATH"

# Set Node.js environment
export NODE_PATH="$AX001_ROOT/node_modules"

# Electron configuration
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
export ELECTRON_CUSTOM_DIR="$AX001_ROOT/node_modules/electron/dist"

# Project-specific environment variables
export AX001_DESKTOP_APP_MODE="room"
export AX001_DESKTOP_RUNTIME="next"
export AX001_DESKTOP_PORT="3030"

echo "AX-001 environment activated"
echo "Project root: $AX001_ROOT"
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"
