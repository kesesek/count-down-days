variable "dynamo_table_name" {
  description = "Name of the DynamoDB table used by the Lambda function"
  type        = string
}

variable "user_pool_id" {
  description = "Cognito User Pool ID"
  type        = string
}

variable "app_client_id" {
  description = "Cognito App Client ID"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}