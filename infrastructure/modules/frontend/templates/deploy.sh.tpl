#!/bin/bash
set -e

echo "Building frontend..."
cd ../../apps/frontend
yarn build

echo "Setting backend URL in build..."
echo "VITE_API_URL=${backend_url}" > dist/.env.production

echo "Syncing to S3..."
aws s3 sync dist/ s3://${bucket_name}/ --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id ${cloudfront_id} --paths "/*"

echo "Frontend deployed successfully!"
echo "URL: https://$(aws cloudfront get-distribution --id ${cloudfront_id} --query 'Distribution.DomainName' --output text)"
