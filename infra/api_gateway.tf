resource "aws_apigatewayv2_api" "http_api" {
    name = "events_api"
    protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "create_event_integration" {
    api_id = aws_apigatewayv2_api.http_api.id
    integration_type = "AWS_PROXY"
    integration_uri = aws_lambda_function.create_event.invoke_arn
    integration_method = "GET"
    payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "create_event_route" {
    api_id = aws_apigatewayv2_api.http_api.id
    route_key = "POST/events"
    target = "intergrations/${aws_apigatewayv2_integration.create_event_integration.id}"
}

resource "aws_lambda_permission" "apigw_lambda: {
    statement_id = "AllowAPIGatewayInvoke"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.create_event.function_name
    principal = "apigateway.amazonaws.com"
    source_arn = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}