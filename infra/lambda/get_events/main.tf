resource "aws_iam_role" "lambda_exec_role_get_events" {
  name = "lambda_exec_role_get_events"

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

resource "aws_iam_policy_attachment" "lambda_logs_get_events" {
  name       = "lambda_logs_get_events"
  roles      = [aws_iam_role.lambda_exec_role_get_events.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "get_events" {
  function_name    = "get_events"
  filename         = "${path.module}/../../../lambda_src/get_events/get_events.zip"
  handler          = "handler.lambda_handler"
  source_code_hash = filebase64sha256("${path.module}/../../../lambda_src/get_events/get_events.zip")

  runtime = "python3.11"
  role    = aws_iam_role.lambda_exec_role_get_events.arn
  timeout = 10

  environment {
    variables = {
      DYNAMODB_TABLE_NAME = var.dynamo_table_name
    }
  }
}

data "archive_file" "get_events_zip" {
  type        = "zip"
  source_file = "${path.module}/../../../lambda_src/get_events/handler.py"
  output_path = "${path.module}/../../../lambda_src/get_events/get_events.zip"
}

data "aws_caller_identity" "current" {}

resource "aws_iam_policy" "dynamodb_query_policy" {
  name = "get_events_dynamodb_query"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement: [
      {
        Action = [
          "dynamodb:Query"
        ],
        Effect   = "Allow",
        Resource = "arn:aws:dynamodb:${var.aws_region}:${data.aws_caller_identity.current.account_id}:table/${var.dynamo_table_name}"
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "attach_dynamodb_query_policy" {
  name       = "attach_dynamodb_query_policy"
  roles      = [aws_iam_role.lambda_exec_role_get_events.name]
  policy_arn = aws_iam_policy.dynamodb_query_policy.arn
}