output "vpc_id" {
  description = "VPC ID"
  value       = module.infrastructure.vpc_id
}

output "backend_url" {
  description = "Backend API URL"
  value       = module.infrastructure.backend_url
}

output "frontend_url" {
  description = "Frontend URL"
  value       = module.infrastructure.frontend_url
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = module.infrastructure.lambda_function_name
}

output "passes_bucket" {
  description = "S3 bucket for passes"
  value       = module.infrastructure.passes_bucket_name
}

output "images_bucket" {
  description = "S3 bucket for images"
  value       = module.infrastructure.images_bucket_name
}
