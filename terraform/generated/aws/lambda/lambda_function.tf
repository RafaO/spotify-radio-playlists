resource "aws_lambda_function" "playlist-canal-fiesta" {
  architectures = ["x86_64"]
  description   = "Scrapes canal fiesta top 50 and updates a playlist in Spotify accordingly"

  environment {
    variables = {
      SENTRY_DSN = var.sentry_dsn
      DB_NAME = var.db_name
    }
  }

  ephemeral_storage {
    size = "512"
  }
  filename                       = "../../../../canal-fiesta-crawler/dist/index.zip"
  function_name                  = "playlist-canal-fiesta"
  handler                        = "index.handler"
  memory_size                    = "128"
  package_type                   = "Zip"
  reserved_concurrent_executions = "-1"
  role                           = "arn:aws:iam::575730407396:role/service-role/playlist-canal-fiesta-role-i16ivp0t"
  runtime                        = "nodejs20.x"
  source_code_hash               = "2XUcqXYM91uoCKZm/rboHN/T1m7iSd1v12WRkD/MrHg="

  tags = {
    "lambda-console:blueprint" = "https-request"
  }

  tags_all = {
    "lambda-console:blueprint" = "https-request"
  }

  timeout = "60"

  tracing_config {
    mode = "PassThrough"
  }
}
