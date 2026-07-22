output "api_url" {
  description = "Public HTTPS URL served by App Runner"
  value       = "https://${aws_apprunner_service.api.service_url}"
}

output "ecr_repository_url" {
  description = "ECR repository the image is pushed to"
  value       = aws_ecr_repository.api.repository_url
}

output "rds_endpoint" {
  description = "RDS Postgres endpoint (host:port)"
  value       = aws_db_instance.main.endpoint
}

output "db_password" {
  description = "Generated Postgres master password"
  value       = random_password.db.result
  sensitive   = true
}
