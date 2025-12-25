# Wallet Pass - Deployment Guide

Complete guide for deploying the Wallet Pass application to AWS using Terraform.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured (`aws configure`)
- Terraform >= 1.0 installed
- Docker installed
- Node.js 20+ and Yarn 4 installed

## Architecture Overview

The infrastructure consists of:

- **Frontend**: React SPA → S3 → CloudFront CDN
- **Backend**: Node.js API → ECS Fargate → Application Load Balancer
- **Storage**: S3 buckets for passes, images, and static assets
- **Secrets**: AWS Secrets Manager for Apple certificates
- **Networking**: VPC with public/private subnets, NAT gateways

## Step-by-Step Deployment

### 1. Setup Terraform State Backend (One-Time)

```bash
# Run the setup script
./scripts/setup-state-backend.sh

# Or manually:
aws s3 mb s3://wallet-pass-terraform-state --region us-east-1
aws s3api put-bucket-versioning \
  --bucket wallet-pass-terraform-state \
  --versioning-configuration Status=Enabled

aws dynamodb create-table \
  --table-name wallet-pass-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

Uncomment the backend configuration in `infrastructure/backend.tf`.

### 2. Initialize Terraform

```bash
./scripts/terraform-init.sh dev
```

This will:
- Initialize Terraform
- Download required providers
- Setup remote state

### 3. Configure Variables

Copy and edit the example variables file:

```bash
cp infrastructure/environments/dev/terraform.tfvars.example \
   infrastructure/environments/dev/terraform.tfvars
```

Edit `terraform.tfvars` with your values:

```hcl
aws_region = "us-east-1"
project_name = "wallet-pass"
environment = "dev"
# ... other settings
```

### 4. Create ECR Repository

First, create only the ECR repository to get the URL:

```bash
cd infrastructure/environments/dev
terraform apply -target=module.infrastructure.module.compute.aws_ecr_repository.backend
```

Get the repository URL:

```bash
terraform output -raw ecr_repository_url
```

### 5. Build and Push Backend Image

```bash
# Login to ECR
ECR_URL=$(cd infrastructure/environments/dev && terraform output -raw ecr_repository_url)
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $ECR_URL

# Build from project root
docker build -t wallet-pass-backend:latest -f apps/backend/Dockerfile .

# Tag and push
docker tag wallet-pass-backend:latest $ECR_URL:latest
docker push $ECR_URL:latest
```

Or use the deployment script:

```bash
./scripts/deploy-backend.sh dev
```

### 6. Update Backend Image in Terraform

Edit `infrastructure/environments/dev/terraform.tfvars`:

```hcl
backend_image = "<account-id>.dkr.ecr.us-east-1.amazonaws.com/wallet-pass-dev-backend:latest"
```

### 7. Deploy Full Infrastructure

```bash
cd infrastructure/environments/dev

# Review the plan
terraform plan

# Apply (this will take 10-15 minutes)
terraform apply
```

Resources created:
- VPC with public/private subnets
- NAT Gateways and Internet Gateway
- S3 buckets (passes, images, frontend)
- CloudFront distribution
- ECS Fargate cluster and service
- Application Load Balancer
- Secrets Manager secrets
- IAM roles and policies

### 8. Configure Apple Wallet Credentials

Update the secrets with your Apple certificates:

```bash
# Encode your certificates to base64
CERT_PEM=$(base64 < path/to/certificate.pem | tr -d '\n')
KEY_PEM=$(base64 < path/to/private-key.pem | tr -d '\n')
WWDR_PEM=$(base64 < path/to/wwdr.pem | tr -d '\n')

# Update secret
aws secretsmanager put-secret-value \
  --secret-id wallet-pass-dev-apple-credentials \
  --secret-string "{
    \"passTypeIdentifier\": \"pass.com.yourcompany.yourpass\",
    \"teamIdentifier\": \"YOUR_TEAM_ID\",
    \"certificatePem\": \"$CERT_PEM\",
    \"privateKeyPem\": \"$KEY_PEM\",
    \"wwdrCertPem\": \"$WWDR_PEM\"
  }"
```

### 9. Deploy Frontend

```bash
./scripts/deploy-frontend.sh dev
```

This will:
- Build the React application
- Upload to S3
- Invalidate CloudFront cache

### 10. Verify Deployment

```bash
cd infrastructure/environments/dev

# Get URLs
terraform output backend_url
terraform output frontend_url

# Test backend
curl $(terraform output -raw backend_url)/health

# Open frontend
open $(terraform output -raw frontend_url)
```

## Post-Deployment

### Monitor Backend Logs

```bash
aws logs tail /ecs/wallet-pass-dev-backend --follow
```

### Check ECS Service Status

```bash
CLUSTER=$(cd infrastructure/environments/dev && terraform output -json | jq -r '.ecs_cluster_name.value')
SERVICE=$(cd infrastructure/environments/dev && terraform output -json | jq -r '.backend_service_name.value')

aws ecs describe-services --cluster $CLUSTER --services $SERVICE
```

### Update Backend Code

After making code changes:

```bash
./scripts/deploy-backend.sh dev
```

### Update Frontend Code

After making code changes:

```bash
./scripts/deploy-frontend.sh dev
```

## Scaling

### Manual Scaling

Edit `terraform.tfvars`:

```hcl
backend_desired_count = 4
backend_cpu = 512
backend_memory = 1024
```

Apply changes:

```bash
cd infrastructure/environments/dev
terraform apply
```

### Auto Scaling

Auto-scaling is configured automatically:
- Scales based on CPU (target: 70%) and Memory (target: 80%)
- Min: `backend_desired_count`
- Max: 10 tasks

## Cost Optimization

Estimated monthly costs (us-east-1, dev environment):

- **VPC & Networking**: ~$65/month (2 NAT Gateways)
- **ECS Fargate**: ~$15/month (1 task, 0.25 vCPU, 0.5 GB)
- **ALB**: ~$20/month
- **S3**: ~$1/month (low usage)
- **CloudFront**: ~$1/month (low usage)
- **Secrets Manager**: ~$1/month (2 secrets)
- **Data Transfer**: Variable

**Total: ~$103/month**

### Cost Reduction Tips

1. **Use single NAT Gateway** (not recommended for production):
   - Edit `infrastructure/modules/networking/main.tf`
   - Create only one NAT Gateway
   - Update private route tables

2. **Use Fargate Spot** (for non-production):
   - Edit ECS service capacity provider

3. **Reduce ALB idle timeout**
4. **Enable S3 Intelligent Tiering**

## Troubleshooting

### Backend tasks failing to start

Check task definition:
```bash
aws ecs describe-tasks --cluster <cluster> --tasks <task-id>
```

Common issues:
- Image pull errors (ECR permissions)
- Port conflicts
- Health check failures

### CloudFront showing 403 errors

- Check S3 bucket policy
- Verify CloudFront OAC configuration
- Ensure index.html exists

### Cannot connect to backend

- Check security groups
- Verify ALB health checks
- Check ECS service events

## Cleanup

To destroy all infrastructure:

```bash
cd infrastructure/environments/dev

# WARNING: This deletes everything including data
terraform destroy
```

To keep data, remove S3 bucket deletion from state first:

```bash
terraform state rm module.infrastructure.module.storage.aws_s3_bucket.passes
terraform state rm module.infrastructure.module.storage.aws_s3_bucket.images
```

## Production Deployment

For production:

1. Create new environment:
   ```bash
   cp -r infrastructure/environments/dev infrastructure/environments/prod
   ```

2. Update variables:
   - Increase task count
   - Use larger CPU/memory
   - Enable deletion protection
   - Configure custom domain
   - Add SSL certificate

3. Setup CI/CD pipeline
4. Configure monitoring and alerts
5. Enable AWS WAF on CloudFront
6. Setup backup policies

## Support

For issues:
- Check CloudWatch Logs: `/ecs/wallet-pass-dev-backend`
- Review Terraform state: `terraform show`
- Validate config: `terraform validate`
- Check AWS Service Health Dashboard

## Next Steps

- [ ] Configure custom domain name
- [ ] Add SSL/TLS certificate
- [ ] Setup CloudWatch alarms
- [ ] Configure backup policies
- [ ] Add RDS database (optional)
- [ ] Setup CI/CD pipeline
- [ ] Enable AWS WAF
- [ ] Configure Route53 health checks
