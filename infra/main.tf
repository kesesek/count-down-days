provider "aws" {
  region = "ap-southeast-2"
}

module "lambda_create_event" {
  source = "./lambda"
}
module "api_gateway_create_event" {
  source = "./api_gateway"
  lambda_arn  = module.lambda_create_event.create_event_lambda_arn
  lambda_name = module.lambda_create_event.create_event_lambda_name
  region = var.region
}

resource "aws_dynamodb_table" "events" {
    name = "CountdownEvents"
    billing_mode = "PAY_PER_REQUEST"
    hash_key = "user_id"
    range_key = "event_id"

    attribute {
        name = "user_id"
        type = "S"
    }

    attribute {
        name = "event_id"
        type = "S"
    }

    tags = {
        Name = "CountdownEvents"
        Enviroment  = "dev"
    }
}