resource "aws_api_gateway_rest_api" "create_event_api" {
  name = "CreateEventAPI"
}

resource "aws_api_gateway_resource" "create_event_resource" {
  rest_api_id = aws_api_gateway_rest_api.create_event_api.id
  parent_id   = aws_api_gateway_rest_api.create_event_api.root_resource_id
  path_part   = "create-event"
}

resource "aws_api_gateway_method" "post_method" {
  rest_api_id   = aws_api_gateway_rest_api.create_event_api.id
  resource_id   = aws_api_gateway_resource.create_event_resource.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id
}

resource "aws_api_gateway_authorizer" "cognito_authorizer" {
  name                    = "CognitoAuthorizer"
  rest_api_id             = aws_api_gateway_rest_api.create_event_api.id
  identity_source         = "method.request.header.Authorization"
  type                    = "COGNITO_USER_POOLS"
  provider_arns           = [var.user_pool_arn]
}

resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.create_event_api.id
  resource_id             = aws_api_gateway_resource.create_event_resource.id
  http_method             = aws_api_gateway_method.post_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arn
}

resource "aws_lambda_permission" "api_gateway_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.create_event_api.execution_arn}/*/*"
}

resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.create_event_api.id
  depends_on  = [aws_api_gateway_integration.lambda_integration]
}

resource "aws_api_gateway_stage" "prod" {
  stage_name    = "prod"
  rest_api_id   = aws_api_gateway_rest_api.create_event_api.id
  deployment_id = aws_api_gateway_deployment.api_deployment.id
}

output "create_event_api_url" {
  value = "https://${aws_api_gateway_rest_api.create_event_api.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_stage.prod.stage_name}/create-event"
}