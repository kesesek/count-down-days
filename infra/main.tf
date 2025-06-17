provider "aws" {
  region = var.aws_region
}

module "lambda_create_event" {
  source            = "./lambda/create_event"
  aws_region        = var.aws_region
  dynamo_table_name = var.dynamo_table_name
  user_pool_id      = var.user_pool_id
  app_client_id     = var.app_client_id
}

module "lambda_get_events" {
  source            = "./lambda/get_events"
  aws_region        = var.aws_region
  dynamo_table_name = var.dynamo_table_name
  user_pool_id      = var.user_pool_id
  app_client_id     = var.app_client_id
}

module "api_gateway" {
  source = "./api_gateway"

  aws_region    = var.aws_region
  user_pool_arn = var.user_pool_arn

  create_event_lambda_arn  = module.lambda_create_event.create_event_lambda_arn
  create_event_lambda_name = module.lambda_create_event.create_event_lambda_name

  get_events_lambda_arn  = module.lambda_get_events.get_events_lambda_arn
  get_events_lambda_name = module.lambda_get_events.get_events_lambda_name
}

resource "aws_dynamodb_table" "events" {
  name         = "CountdownEvents"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "user_id"
  range_key    = "event_id"

  attribute {
    name = "user_id"
    type = "S"
  }

  attribute {
    name = "event_id"
    type = "S"
  }

  tags = {
    Name       = "CountdownEvents"
    Enviroment = "dev"
  }
}