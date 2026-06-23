terraform {
  required_providers {
    supabase = {
      source = "supabase/supabase"
      version = "~> 1.0"
    }
  }
}

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

provider "supabase" {
  access_token = var.supabase_access_token
}

resource "supabase_project" "delivery" {
  name       = var.project_name
  region     = var.project_region
  plan       = "free"
  db_password = var.db_password
}
