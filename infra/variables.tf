variable "aws_region" {
  description = "AWS region where every resource is created"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Prefix applied to every resource name"
  type        = string
  default     = "techmart"
}

variable "db_name" {
  description = "Postgres database name"
  type        = string
  default     = "techmart"
}

variable "db_username" {
  description = "Postgres master username"
  type        = string
  default     = "techmart"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "container_port" {
  description = "Port the API listens on inside the container"
  type        = number
  default     = 3000
}

variable "image_tag" {
  description = "ECR image tag App Runner deploys"
  type        = string
  default     = "latest"
}
