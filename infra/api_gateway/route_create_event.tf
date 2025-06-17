resource "aws_api_gateway_resource" "create_event_resource" {
  rest_api_id = aws_api_gateway_rest_api.countdown_api.id
  parent_id   = aws_api_gateway_rest_api.countdown_api.root_resource_id
  path_part   = "create-event"
}

resource "aws_api_gateway_method" "post_method" {
  rest_api_id   = aws_api_gateway_rest_api.countdown_api.id
  resource_id   = aws_api_gateway_resource.create_event_resource.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id
}

resource "aws_api_gateway_integration" "lambda_integration_create_event" {
  rest_api_id             = aws_api_gateway_rest_api.countdown_api.id
  resource_id             = aws_api_gateway_resource.create_event_resource.id
  http_method             = aws_api_gateway_method.post_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.create_event_lambda_arn
}

resource "aws_lambda_permission" "create_event_permission" {
  statement_id  = "AllowAPIGatewayInvokeCreateEvent"
  action        = "lambda:InvokeFunction"
  function_name = var.create_event_lambda_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.countdown_api.execution_arn}/*/*"
}