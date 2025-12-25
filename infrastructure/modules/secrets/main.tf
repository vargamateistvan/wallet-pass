# AWS Secrets Manager for Apple Wallet Credentials
resource "aws_secretsmanager_secret" "apple_credentials" {
  name        = "${var.project_name}-${var.environment}-apple-credentials"
  description = "Apple Wallet Pass signing credentials"

  tags = {
    Name = "${var.project_name}-${var.environment}-apple-credentials"
  }
}

# Placeholder secret version - replace with actual values
resource "aws_secretsmanager_secret_version" "apple_credentials" {
  secret_id = aws_secretsmanager_secret.apple_credentials.id

  secret_string = jsonencode({
    passTypeIdentifier = "pass.com.example.demo"
    teamIdentifier     = "DEMO123456"
    # Add these manually after terraform apply:
    # certificatePem = "<base64-encoded-certificate>"
    # privateKeyPem  = "<base64-encoded-private-key>"
    # wwdrCertPem    = "<base64-encoded-wwdr-certificate>"
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}

# Secret for database credentials (if using RDS)
resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "${var.project_name}-${var.environment}-db-credentials"
  description = "Database credentials for wallet pass application"

  tags = {
    Name = "${var.project_name}-${var.environment}-db-credentials"
  }
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id

  secret_string = jsonencode({
    username = "admin"
    password = random_password.db_password.result
    engine   = "postgres"
    host     = "placeholder" # Will be updated if RDS module is added
    port     = 5432
    dbname   = "${var.project_name}_${var.environment}"
  })
}

# Generate random password for database
resource "random_password" "db_password" {
  length  = 32
  special = true
}
