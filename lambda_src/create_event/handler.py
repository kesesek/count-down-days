import json, boto3, os, uuid
from datetime import datetime

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["DYNAMO_TABLE_NAME"])

def lambda_handler(event, context):
    try:
        claims = event["requestContext"]["authorizer"]["claims"]
        user_email = claims.get("email")

        if not user_email:
            return {"statusCode": 400, "body": json.dumps({"error": "User email not found"})}

        body = json.loads(event["body"])
        title = body["title"]
        target_date = body["target_date"]
        is_pinned = body.get("is_pinned", False)

        item = {
            "user_id": user_email,
            "event_id": str(uuid.uuid4()),
            "title": title,
            "target_date": target_date,
            "is_pinned": is_pinned,
            "created_at": datetime.utcnow().isoformat(),
        }

        table.put_item(Item=item)

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Event created", "item": item}),
        }

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}