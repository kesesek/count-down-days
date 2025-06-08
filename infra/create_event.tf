resource "aws_lambda_function" "create_event" {
    function_name = "create_event"
    role = aws_iam_role.lambda_exec.arn
    handler = "handler.lambda_handler"
    runtime = "python3.11"

    filename = "${path.module}/../lambda/create_event.zip"
    source_code_hash = filebase64sha256("${path.module}/../lambda/create_event.zip)

    environment {
        variables = {
            DYNAMODB_TABLE_NAME = aws_dynamodb_table.event.name
        }
    }
}