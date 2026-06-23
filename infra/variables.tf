variable "supabase_access_token" {
  description = "Supabase personal access token"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Supabase project name"
  type        = string
  default     = "delivery"
}

variable "project_region" {
  description = "Supabase project region"
  type        = string
  default     = "us-east-1"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}
