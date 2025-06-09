import json, boto3, os, uuid, jwt
from datetime import datetime

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["DYNAMO_TABLE_NAME"])
COGNITO_JWT_ISSUER = os.environ["COGNITO_JWT_ISSUER"]
COGNITO_JWT_AUDIENCE = os.environ["COGNITO_JWT_AUDIENCE"]

def lambda_handler(event, context):
    try:
        auth_header = event["headers"].get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return {"statusCode": 401, "body": json.dumps({"error": "Missing or invalid token"})}
        token = auth_header.split(" ")[1]

        decoded_token = jwt.decoded(token, options={"verify_signature": False}, audience=COGNITO_JWT_AUDIENCE)

        user_email = decoded_token.get("username")
        if not user_email:
            return {"statusCode": 400, "body": json.dumps({"error": "User email not found in token"})}
        
        body = json.loads(event["body"])
        title = body["title"]
        target_date = body["targetDate"]
        is_pinned = body.get("isPinned", False)

        item = {
                "eventId": str(uuid.uuid4()),
                "userEmail": user_email,
                "title": title,
                "targetDate": target_date,
                "isPinned": is_pinned,
                "createAt": datetime.utcnow().isoformat(),
            }

        table.put_item(Item=item)

        return {"statusCode": 200, "body": json.dumps({"message": "Event created", "item": item})}

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
