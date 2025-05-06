#!/bin/bash

# Exit immediately on error
set -e

# Update package index
echo "Updating package index..."
sudo apt update

# Install curl if missing (needed for Node install)
sudo apt install -y curl

# Install Node.js (LTS version) via NodeSource
echo "Installing Node.js (LTS)..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Check Node and npm versions
echo "📋 Node version: $(node -v)"
echo "📋 npm version: $(npm -v)"

# Install pnpm globally
echo "Installing pnpm..."
npm install -g pnpm

# Check pnpm version
echo "pnpm version: $(pnpm -v)"

# Install project dependencies (assumes you're in your Next.js project directory)
echo "Installing project dependencies with pnpm..."
pnpm install

echo "All dependencies installed successfully with pnpm!"
