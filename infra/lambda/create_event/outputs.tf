output "create_event_lambda_arn" {
  value = aws_lambda_function.create_event.invoke_arn
}

output "create_event_lambda_name" {
  value = aws_lambda_function.create_event.function_name
}