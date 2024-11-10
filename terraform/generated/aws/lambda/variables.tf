variable "sentry_dsn" {
  description = "DSN for Sentry logging"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "The name of the DynamoDB table used for caching"
  type        = string
  default     = "songs-cache"
}
