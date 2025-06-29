data "aws_caller_identity" "current" {}

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

resource "aws_iam_policy" "dynamodb_put_policy" {
  name = "create_event_dynamodb_put"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement: [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:PutItem"
        ],
        Resource = "arn:aws:dynamodb:${var.aws_region}:${data.aws_caller_identity.current.account_id}:table/${var.dynamo_table_name}"
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "attach_dynamodb_put_policy" {
  name       = "attach_dynamodb_put_policy_create_event"
  roles      = [aws_iam_role.lambda_exec_role.name]
  policy_arn = aws_iam_policy.dynamodb_put_policy.arn
}

resource "aws_lambda_function" "create_event" {
  function_name = "create_event"
  filename      = "${path.module}/../../../lambda_src/create_event/create_event.zip"
  handler       = "handler.lambda_handler"
  source_code_hash = filebase64sha256("${path.module}/../../../lambda_src/create_event/create_event.zip")
  layers = [
    "arn:aws:lambda:ap-southeast-2:770693421928:layer:Klayers-p39-cryptography:19"
  ]

  runtime = "python3.9"
  role    = aws_iam_role.lambda_exec_role.arn
  timeout = 10

  environment {
    variables = {
      DYNAMO_TABLE_NAME = var.dynamo_table_name
      COGNITO_JWT_ISSUER = "https://cognito-idp.${var.aws_region}.amazonaws.com/${var.user_pool_id}"
      COGNITO_JWT_AUDIENCE = var.app_client_id
      COGNITO_REGION = var.aws_region
      COGNITO_USERPOOL_ID = var.user_pool_id
    }
  }
}