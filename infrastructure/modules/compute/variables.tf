variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for ECS tasks"
  type        = list(string)
}

variable "public_subnet_ids" {
  description = "Public subnet IDs for ALB"
  type        = list(string)
}

variable "backend_image" {
  description = "Docker image for backend"
  type        = string
}

variable "backend_cpu" {
  description = "CPU units for backend task"
  type        = number
}

variable "backend_memory" {
  description = "Memory for backend task (MB)"
  type        = number
}

variable "backend_desired_count" {
  description = "Desired number of backend tasks"
  type        = number
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
