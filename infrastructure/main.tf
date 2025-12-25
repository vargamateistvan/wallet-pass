terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Networking
module "networking" {
  source = "./modules/networking"

  project_name        = var.project_name
  environment         = var.environment
  vpc_cidr            = var.vpc_cidr
  availability_zones  = var.availability_zones
  private_subnet_cidrs = var.private_subnet_cidrs
  public_subnet_cidrs  = var.public_subnet_cidrs
}

# Storage
module "storage" {
  source = "./modules/storage"

  project_name = var.project_name
  environment  = var.environment
}

# Secrets
module "secrets" {
  source = "./modules/secrets"

  project_name = var.project_name
  environment  = var.environment
}

# Lambda Backend
module "lambda" {
  source = "./modules/lambda"

  project_name        = var.project_name
  environment         = var.environment
  passes_bucket_name  = module.storage.passes_bucket_name
  images_bucket_name  = module.storage.images_bucket_name
  apple_secrets_arn   = module.secrets.apple_secrets_arn
  lambda_memory_size  = var.lambda_memory_size
  lambda_timeout      = var.lambda_timeout
}

# Frontend Distribution
module "frontend" {
  source = "./modules/frontend"

  project_name        = var.project_name
  environment         = var.environment
  frontend_bucket_id  = module.storage.frontend_bucket_id
  frontend_bucket_arn = module.storage.frontend_bucket_arn
  backend_url         = module.lambda.backend_url
}
