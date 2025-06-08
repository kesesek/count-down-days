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