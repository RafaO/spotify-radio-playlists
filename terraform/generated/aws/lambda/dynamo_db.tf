resource "aws_dynamodb_table" "songs-cache" {
  attribute {
    name = "searchString"
    type = "S"
  }

  billing_mode                = "PROVISIONED"
  deletion_protection_enabled = "false"
  hash_key                    = "searchString"
  name                        = var.db_name

  point_in_time_recovery {
    enabled = "false"
  }

  read_capacity  = "1"
  stream_enabled = "false"
  table_class    = "STANDARD"
  write_capacity = "1"
}
