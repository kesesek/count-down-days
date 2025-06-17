output "dynamodb_table_name" {
  value = aws_dynamodb_table.events.name
}

output "create_event_api_url" {
  value = module.api_gateway.create_event_api_url
}

output "get_events_api_url" {
  value = module.api_gateway.get_events_api_url
}