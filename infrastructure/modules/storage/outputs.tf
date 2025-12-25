output "passes_bucket_name" {
  description = "Name of S3 bucket for passes"
  value       = aws_s3_bucket.passes.id
}

output "passes_bucket_arn" {
  description = "ARN of S3 bucket for passes"
  value       = aws_s3_bucket.passes.arn
}

output "images_bucket_name" {
  description = "Name of S3 bucket for images"
  value       = aws_s3_bucket.images.id
}

output "images_bucket_arn" {
  description = "ARN of S3 bucket for images"
  value       = aws_s3_bucket.images.arn
}

output "frontend_bucket_id" {
  description = "ID of S3 bucket for frontend"
  value       = aws_s3_bucket.frontend.id
}

output "frontend_bucket_arn" {
  description = "ARN of S3 bucket for frontend"
  value       = aws_s3_bucket.frontend.arn
}

output "frontend_bucket_name" {
  description = "Name of S3 bucket for frontend"
  value       = aws_s3_bucket.frontend.id
}
