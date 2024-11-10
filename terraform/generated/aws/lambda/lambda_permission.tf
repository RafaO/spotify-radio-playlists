resource "aws_lambda_permission" "lambda-5fb7859b-8bc6-4cc6-a9fb-a3712d06b01c" {
  action        = "lambda:InvokeFunction"
  function_name = "playlist-canal-fiesta"
  principal     = "events.amazonaws.com"
  source_arn    = "arn:aws:events:us-east-1:575730407396:rule/weekly-on-sundays"
  statement_id  = "lambda-5fb7859b-8bc6-4cc6-a9fb-a3712d06b01c"
}
