# Wallet Pass Infrastructure

Terraform infrastructure for the Wallet Pass application using **serverless architecture** with AWS Lambda.

## Architecture

- **Frontend**: React SPA hosted on S3 with CloudFront CDN
- **Backend**: Node.js API running on AWS Lambda with API Gateway
- **Storage**: S3 buckets for wallet passes, images, and frontend assets
- **Secrets**: AWS Secrets Manager for Apple Wallet certificates
- **Networking**: Simplified VPC (Lambda runs outside VPC for cost savings)

## Cost Estimate

**Development environment: ~$5-10/month**
- Lambda: Free tier (1M requests/month) or ~$0.20 per million requests
- API Gateway: Free tier (1M requests/month) or $1 per million requests
- S3: ~$1 (storage)
- CloudFront: Free tier or ~$1
- Secrets Manager: $0.40 per secret/month

**Production environment (estimated 100k requests/month): ~$15/month**

### vs. Previous ECS Architecture
- **ECS Cost**: ~$103/month (NAT Gateway $65, Fargate $15, ALB $20)
- **Lambda Cost**: ~$5-10/month
- **Savings**: ~$90/month (87% reduction) 💰

## Prerequisites

1. **AWS CLI** configured with appropriate credentials
   ```bash
   aws configure
   ```

2. **Terraform** >= 1.0
   ```bash
   brew install terraform
   ```

3. **Docker** (for building backend image)
   ```bash
   brew install docker
   ```

## Quick Start

### 1. Create Terraform State Backend (one-time setup)

```bash
# Create S3 bucket for state
aws s3 mb s3://wallet-pass-terraform-state --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket wallet-pass-terraform-state \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket wallet-pass-terraform-state \
  --server-side-encryption-configuration \
  '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name wallet-pass-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

Then uncomment the backend configuration in `infrastructure/backend.tf`.

### 2. Deploy Backend to Lambda

```bash
# Navigate to dev environment
cd infrastructure/environments/dev

# Initialize Terraform
terraform init

# Apply infrastructure
terraform apply

# Get Lambda function name
FUNCTION_NAME=$(terraform output -raw lambda_function_name)

# Deploy backend code
cd ../../..
./scripts/deploy-backend.sh dev
```

### 5. Configure Apple Wallet Credentials

```bash
aws secretsmanager put-secret-value \
  --secret-id wallet-pass-dev-apple-credentials \
  --secret-string '{
    "passTypeIdentifier": "pass.com.yourcompany.yourpass",
    "teamIdentifier": "YOUR_TEAM_ID",
    "certificatePem": "<base64-encoded-certificate>",
    "privateKeyPem": "<base64-encoded-private-key>",
    "wwdrCertPem": "<base64-encoded-wwdr-certificate>"
  }'
```

### 6. Deploy Frontend

```bashOutputs
Use the deployment script
./scripts/deploy-frontend.sh dev
infrastructure/
├── main.tf                    # Root module
├── variables.tf              # Root variables
├── outputs.tf                # Root outputs
├── backend.tf                # Terraform state backend
├── modules/Lambda API Gateway endpoint
- `lambda_function_name`: Lambda function name for deployments
- `frontend_url`: CloudFront URL for frontend
│   ├── compute/              # ECS Fargate, ALB, ECR
│   ├── secrets/              # AWS Secrets Manager
│   └── frontend/             # Frontend deployment helpers
└── environments/
    └── dev/                  # Development environment
        ├── main.tf
        ├── variables.tf
        ├── outputs.tf
        └── terraform.tfvars.example
```

## Cost Optimization
Simplified VPC (no NAT gateways)
│   serverless architecture provides automatic cost optimization:

1. **Pay per use**: Only pay for actual requests, not idle time
2. **Auto-scaling**: Lambda scales automatically (0 to thousands of instances)
3. **No NAT costs**: Lambda runs outside VPC, eliminating NAT Gateway costs ($65/month savings)
4. **No load balancer**: API Gateway replaces ALB ($20/month savings)
5. **Free tier**: AWS Lambda free tier covers first 1M requests/month

## Security Features

- All S3 buckets encrypted at rest (AES256)
- Secrets stored in AWS Secrets Manager
- Private subnets for backend tasks
- Security groups with minimal required access
- VPC endpoints for secure AWS service access
- CloudFront with HTTPS redirect

## Updating Infrastructure

```bash
cd infrastructure/environments/dev

# Review changes
terraform plan

# Apply changes
terraform apply

# For specific module updates
terraform apply -target=module.infrastructure.module.compute
```

## Destroying Infrastructure

⚠️ **Warning**: This will delete all resources including data in S3 buckets.

```bash
cd infrastructure/environments/dev

# Review what will be destroyed
terraform plan -destroy

# Destroy infrastructure
terraform destroy
```

## Troubleshooting

### Backend not responding

Check Lambda logs:
```bash
aws logs tail /aws/lambda/wallet-pass-dev-backend --follow
```

Test Lambda directly:
```bash
aws lambda invoke \
  --function-name wallet-pass-dev-backend \
  --payload '{"httpMethod":"GET","path":"/health"}' \
  response.json
```

### CloudFront showing old version
Lambda timeout errors

Increase timeout in `terraform.tfvars`:
```hcl
lambda_timeout = 60  # seconds
```

### Cannot access backend API

Check ALB health checks:
```bash
aws elbv2 describe-target-health \
  --target-group-arn <target-group-arn>
```

## Additional Environments

To create staging or production environments:

```bash
cp -r infrastructure/envi:

1. **Backend**: Run `./scripts/deploy-backend.sh <env>` to deploy Lambda
2. **Frontend**: Run `./scripts/deploy-frontend.sh <env>` to deploy to S3/CloudFront
3. **Infrastructure**: Run `terraform apply` in `environments/<env>/` for infrastructure changes

Example GitHub Actions workflow:
```yaml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Lambda
        run: ./scripts/deploy-backend.sh dev
      - name: Deploy Frontend
        run: ./scripts/deploy-frontend.sh dev
```

For automated deployments, use the following workflow:

1. Build backend image → Push to ECR
2. Update ECS task definition with new image
3. Build frontend → Deploy to S3 → Invalidate CloudFront
4. Run `terraform apply` for infrastructure changes

## Support

For issues or questions:
- Check AWS CloudWatch Logs for application errors
- Review Terraform state: `terraform show`
- Validate configuration: `terraform validate`

## License

MIT
