output "apple_secrets_arn" {
  description = "ARN of Apple credentials secret"
  value       = aws_secretsmanager_secret.apple_credentials.arn
}

output "apple_secrets_name" {
  description = "Name of Apple credentials secret"
  value       = aws_secretsmanager_secret.apple_credentials.name
}

output "db_secrets_arn" {
  description = "ARN of database credentials secret"
  value       = aws_secretsmanager_secret.db_credentials.arn
}

output "db_secrets_name" {
  description = "Name of database credentials secret"
  value       = aws_secretsmanager_secret.db_credentials.name
}
