variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "passes_bucket_name" {
  description = "S3 bucket name for passes"
  type        = string
}

variable "images_bucket_name" {
  description = "S3 bucket name for images"
  type        = string
}

variable "apple_secrets_arn" {
  description = "ARN of Apple secrets in Secrets Manager"
  type        = string
}

variable "lambda_memory_size" {
  description = "Memory size for Lambda function (MB)"
  type        = number
  default     = 512
}

variable "lambda_timeout" {
  description = "Timeout for Lambda function (seconds)"
  type        = number
  default     = 30
}
