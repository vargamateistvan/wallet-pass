#!/bin/bash
# Setup Terraform remote state backend (one-time setup)
set -e

BUCKET_NAME=${1:-wallet-pass-terraform-state}
TABLE_NAME=${2:-wallet-pass-terraform-locks}
AWS_REGION=${AWS_REGION:-us-east-1}

echo "Setting up Terraform state backend..."

# Create S3 bucket
echo "Creating S3 bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION || echo "Bucket already exists"

# Enable versioning
echo "Enabling versioning..."
aws s3api put-bucket-versioning \
  --bucket $BUCKET_NAME \
  --versioning-configuration Status=Enabled \
  --region $AWS_REGION

# Enable encryption
echo "Enabling encryption..."
aws s3api put-bucket-encryption \
  --bucket $BUCKET_NAME \
  --server-side-encryption-configuration \
  '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"},"BucketKeyEnabled":true}]}' \
  --region $AWS_REGION

# Block public access
echo "Blocking public access..."
aws s3api put-public-access-block \
  --bucket $BUCKET_NAME \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
  --region $AWS_REGION

# Create DynamoDB table for locking
echo "Creating DynamoDB table: $TABLE_NAME"
aws dynamodb create-table \
  --table-name $TABLE_NAME \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region $AWS_REGION || echo "Table already exists"

echo ""
echo "State backend setup complete!"
echo ""
echo "Update infrastructure/backend.tf with:"
echo "  bucket = \"$BUCKET_NAME\""
echo "  dynamodb_table = \"$TABLE_NAME\""
echo "  region = \"$AWS_REGION\""
