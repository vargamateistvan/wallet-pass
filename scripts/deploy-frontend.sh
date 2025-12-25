#!/bin/bash
# Deploy frontend to S3 and CloudFront
set -e

ENVIRONMENT=${1:-dev}
AWS_REGION=${AWS_REGION:-us-east-1}

echo "Deploying frontend to $ENVIRONMENT environment..."

# Get outputs from Terraform
cd infrastructure/environments/$ENVIRONMENT
BUCKET_NAME=$(terraform output -raw frontend_bucket)
CLOUDFRONT_ID=$(terraform output -json | jq -r '.cloudfront_distribution_id.value')
BACKEND_URL=$(terraform output -raw backend_url)

# Build frontend
echo "Building frontend..."
cd ../../../apps/frontend

# Create production env file
echo "VITE_API_URL=$BACKEND_URL" > .env.production

yarn build

# Deploy to S3
echo "Uploading to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html" \
  --region $AWS_REGION

# Upload index.html with no cache
aws s3 cp dist/index.html s3://$BUCKET_NAME/index.html \
  --cache-control "public, max-age=0, must-revalidate" \
  --region $AWS_REGION

# Invalidate CloudFront
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_ID \
  --paths "/*" \
  --region $AWS_REGION

FRONTEND_URL=$(cd ../../infrastructure/environments/$ENVIRONMENT && terraform output -raw frontend_url)
echo "Frontend deployed successfully!"
echo "URL: $FRONTEND_URL"
