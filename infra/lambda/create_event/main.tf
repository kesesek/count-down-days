resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda_exec_role_create_event"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "lambda_logs" {
  name       = "lambda_logs_create_event"
  roles      = [aws_iam_role.lambda_exec_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "create_event" {
  function_name = "create_event"
  filename      = "${path.module}/../../../lambda_src/create_event/create_event.zip"
  handler       = "handler.lambda_handler"
  source_code_hash = filebase64sha256("${path.module}/../../../lambda_src/create_event/create_event.zip")

  runtime = "python3.11"
  role    = aws_iam_role.lambda_exec_role.arn
  timeout = 10

  environment {
    variables = {
      DYNAMO_TABLE_NAME = var.dynamo_table_name
      COGNITO_JWT_ISSUER = "https://cognito-idp.${var.aws_region}.amazonaws.com/${var.user_pool_id}"
      COGNITO_JWT_AUDIENCE = var.app_client_id
    }
  }
}