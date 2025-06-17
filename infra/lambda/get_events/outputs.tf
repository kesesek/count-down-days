output "get_events_lambda_arn" {
  value = aws_lambda_function.get_events.invoke_arn
}

output "get_events_lambda_name" {
  value = aws_lambda_function.get_events.function_name
}