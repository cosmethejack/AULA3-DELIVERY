output "project_id" {
  description = "The ID of the Supabase project"
  value       = supabase_project.delivery.id
}

output "database_url" {
  description = "The database connection string"
  value       = supabase_project.delivery.database_url
  sensitive   = true
}

output "api_url" {
  description = "The Supabase API URL"
  value       = supabase_project.delivery.api_url
}
