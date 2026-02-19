variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "wedding-organiser"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "eu-west-1"
}
