import json, boto3, os
from datetime import datetime

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["DYNAMO_TABLE_NAME"])

def lambda_handler(event, context):
    body = json.loads(event["body"])

    event_id = body["eventId"]
    user_email = body["userEmail"]
    title = body["title"]
    target_date = body["targetDate"]
    is_pinned = body["isPinned"]

    response = table.put_item(
        Item={
            "eventId": event_id,
            "userEmail": user_email,
            "title": title,
            "targetDate": target_date,
            "isPinned": is_pinned,
            "createAt": datetime.utcnow().isoformat()
        }
    )

    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Event created successfully."})
    }
