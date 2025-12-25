# Terraform state backend configuration
# Uncomment and configure after creating the S3 bucket and DynamoDB table

# terraform {
#   backend "s3" {
#     bucket         = "wallet-pass-terraform-state"
#     key            = "env/dev/terraform.tfstate"
#     region         = "us-east-1"
#     encrypt        = true
#     dynamodb_table = "wallet-pass-terraform-locks"
#   }
# }

# To create the state backend resources, run:
# aws s3 mb s3://wallet-pass-terraform-state --region us-east-1
# aws s3api put-bucket-versioning --bucket wallet-pass-terraform-state --versioning-configuration Status=Enabled
# aws s3api put-bucket-encryption --bucket wallet-pass-terraform-state --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
# aws dynamodb create-table --table-name wallet-pass-terraform-locks --attribute-definitions AttributeName=LockID,AttributeType=S --key-schema AttributeName=LockID,KeyType=HASH --billing-mode PAY_PER_REQUEST --region us-east-1
