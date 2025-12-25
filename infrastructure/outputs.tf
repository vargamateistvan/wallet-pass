output "vpc_id" {
  description = "VPC ID"
  value       = module.networking.vpc_id
}

output "backend_url" {
  description = "Backend API URL"
  value       = module.lambda.backend_url
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = module.lambda.lambda_function_name
}

output "frontend_url" {
  description = "Frontend CloudFront URL"
  value       = module.frontend.cloudfront_url
}

output "frontend_bucket_name" {
  description = "S3 bucket for frontend assets"
  value       = module.storage.frontend_bucket_name
}

output "passes_bucket_name" {
  description = "S3 bucket for wallet passes"
  value       = module.storage.passes_bucket_name
}

output "images_bucket_name" {
  description = "S3 bucket for pass images"
  value       = module.storage.images_bucket_name
}

output "apple_secrets_arn" {
  description = "ARN of Apple credentials secret"
  value       = module.secrets.apple_secrets_arn
  sensitive   = true
}
