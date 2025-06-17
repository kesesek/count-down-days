resource "aws_api_gateway_resource" "get_events_resource" {
  rest_api_id = aws_api_gateway_rest_api.countdown_api.id
  parent_id   = aws_api_gateway_rest_api.countdown_api.root_resource_id
  path_part   = "get-events"
}

resource "aws_api_gateway_method" "get_method" {
  rest_api_id   = aws_api_gateway_rest_api.countdown_api.id
  resource_id   = aws_api_gateway_resource.get_events_resource.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id
}

resource "aws_api_gateway_integration" "lambda_integration_get_events" {
  rest_api_id             = aws_api_gateway_rest_api.countdown_api.id
  resource_id             = aws_api_gateway_resource.get_events_resource.id
  http_method             = aws_api_gateway_method.get_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.get_events_lambda_arn
}

resource "aws_lambda_permission" "get_events_permission" {
  statement_id  = "AllowAPIGatewayInvokeGetEvents"
  action        = "lambda:InvokeFunction"
  function_name = var.get_events_lambda_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.countdown_api.execution_arn}/*/*"
}