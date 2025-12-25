#!/bin/bash
# Initialize Terraform infrastructure
set -e

ENVIRONMENT=${1:-dev}

echo "Initializing infrastructure for $ENVIRONMENT environment..."

cd infrastructure/environments/$ENVIRONMENT

# Initialize Terraform
terraform init

# Validate configuration
terraform validate

echo "Terraform initialized successfully!"
echo ""
echo "Next steps:"
echo "1. Review and update terraform.tfvars with your configuration"
echo "2. Run: terraform plan"
echo "3. Run: terraform apply"
