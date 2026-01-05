#!/bin/bash
set -e

echo "Running Vercel build script..."
echo "Current directory: $(pwd)"

# Run turbo build
echo "Executing: yarn turbo build:vercel --filter=frontend"
yarn turbo build:vercel --filter=frontend

echo "Build finished. Searching for built index.html..."
# Find index.html that is inside a dist folder
FOUND_INDEX=$(find . -type f -name "index.html" | grep "/dist/" | head -n 1)

if [ -z "$FOUND_INDEX" ]; then
  echo "Error: Could not find index.html in any dist folder."
  echo "Listing all dist directories found:"
  find . -type d -name dist
  exit 1
fi

echo "Found index.html at: $FOUND_INDEX"
DIST_DIR=$(dirname "$FOUND_INDEX")
echo "Detected build output directory: $DIST_DIR"

# Move to root dist if it's not already there
if [ "$DIST_DIR" != "./dist" ] && [ "$DIST_DIR" != "dist" ]; then
  echo "Moving $DIST_DIR to ./dist"
  rm -rf dist
  mv "$DIST_DIR" dist
else
  echo "Build output is already at ./dist"
fi

echo "Final contents of ./dist:"
ls -la dist
