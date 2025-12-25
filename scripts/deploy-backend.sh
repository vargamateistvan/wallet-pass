#!/bin/bash
# Deploy backend to Lambda
set -e

ENVIRONMENT=${1:-dev}
AWS_REGION=${AWS_REGION:-us-east-1}

echo "Deploying backend to Lambda ($ENVIRONMENT environment)..."

# Get Lambda function name
FUNCTION_NAME=$(cd infrastructure/environments/$ENVIRONMENT && terraform output -raw lambda_function_name)

# Build Lambda deployment package
echo "Building Lambda deployment package..."
cd apps/backend

# Install dependencies
yarn install --production

# Create deployment package
echo "Creating deployment package..."
mkdir -p dist
cp -r node_modules dist/
cp -r src dist/
cp package.json dist/

# Create ZIP file
cd dist
zip -r ../lambda-deployment.zip . -x "*.git*" "*.DS_Store"
cd ..

# Upload to Lambda
echo "Uploading to Lambda..."
aws lambda update-function-code \
  --function-name $FUNCTION_NAME \
  --zip-file fileb://lambda-deployment.zip \
  --region $AWS_REGION

# Wait for update to complete
echo "Waiting for Lambda update to complete..."
aws lambda wait function-updated \
  --function-name $FUNCTION_NAME \
  --region $AWS_REGION

# Clean up
rm -rf dist lambda-deployment.zip

echo "Backend deployed successfully!"
echo "Function: $FUNCTION_NAME"
API_URL=$(cd ../../infrastructure/environments/$ENVIRONMENT && terraform output -raw backend_url)
echo "API URL: $API_URL"
