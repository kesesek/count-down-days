resource "aws_api_gateway_rest_api" "countdown_api" {
  name        = "CountdownAPI"
  description = "API Gateway for countdown app"
}

resource "aws_api_gateway_authorizer" "cognito_authorizer" {
  name            = "CognitoAuthorizer"
  rest_api_id     = aws_api_gateway_rest_api.countdown_api.id
  identity_source = "method.request.header.Authorization"
  type            = "COGNITO_USER_POOLS"
  provider_arns   = [var.user_pool_arn]
}

resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.countdown_api.id

  depends_on = [
    aws_api_gateway_integration.lambda_integration_create_event,
    aws_api_gateway_integration.lambda_integration_get_events,
  ]
}

resource "aws_api_gateway_stage" "prod" {
  stage_name    = "prod"
  rest_api_id   = aws_api_gateway_rest_api.countdown_api.id
  deployment_id = aws_api_gateway_deployment.api_deployment.id
}