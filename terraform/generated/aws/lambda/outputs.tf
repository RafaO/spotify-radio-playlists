output "aws_lambda_function_playlist-canal-fiesta_id" {
  value = aws_lambda_function.playlist-canal-fiesta.id
}

output "aws_lambda_permission_lambda-5fb7859b-8bc6-4cc6-a9fb-a3712d06b01c_id" {
  value = aws_lambda_permission.lambda-5fb7859b-8bc6-4cc6-a9fb-a3712d06b01c.id
}

output "aws_dynamodb_table_songs-cache_id" {
  value = "${aws_dynamodb_table.songs-cache.id}"
}
