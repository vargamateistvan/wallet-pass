variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "frontend_bucket_id" {
  description = "Frontend S3 bucket ID"
  type        = string
}

variable "frontend_bucket_arn" {
  description = "Frontend S3 bucket ARN"
  type        = string
}

variable "backend_url" {
  description = "Backend API URL"
  type        = string
}
