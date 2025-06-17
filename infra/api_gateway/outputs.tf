output "create_event_api_url" {
  value = "https://${aws_api_gateway_rest_api.countdown_api.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_stage.prod.stage_name}/create-event"
}

output "get_events_api_url" {
  value = "https://${aws_api_gateway_rest_api.countdown_api.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_stage.prod.stage_name}/get-events"
}