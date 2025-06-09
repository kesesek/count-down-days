variable "lambda_arn" {
  description = "The ARN of the Lambda function to integrate with API Gateway"
  type        = string
}

variable "lambda_name" {
  description = "The name of the Lambda function for permission setup"
  type        = string
}

variable "aws_region" {
  description = "AWS region used to construct the invoke URL or issuer"
  type        = string
}

variable "user_pool_arn" {
  description = "AWS Cognito user pool arn"
  type = string
}