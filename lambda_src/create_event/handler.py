import json, boto3, os, uuid, jwt
from datetime import datetime
from jwt import PyJWKClient

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["DYNAMO_TABLE_NAME"])
COGNITO_JWT_ISSUER = os.environ["COGNITO_JWT_ISSUER"]
COGNITO_JWT_AUDIENCE = os.environ["COGNITO_JWT_AUDIENCE"]
COGNITO_REGION = os.environ["COGNITO_REGION"]
COGNITO_USERPOOL_ID = os.environ["COGNITO_USERPOOL_ID"]

JWK_URL = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{COGNITO_USERPOOL_ID}/.well-known/jwks.json"
jwk_client = PyJWKClient(JWK_URL)

def lambda_handler(event, context):
    try:
        auth_header = event["headers"].get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return {"statusCode": 401, "body": json.dumps({"error": "Missing or invalid token"})}
        token = auth_header.split(" ")[1]

        signing_key = jwk_client.get_signing_key_from_jwt(token).key

        decoded_token = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            audience=COGNITO_JWT_AUDIENCE,
            issuer=f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{COGNITO_USERPOOL_ID}"
        )

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
    except jwt.ExpiredSignatureError:
        return {"statusCode": 401, "body": json.dumps({"error": "Token expired"})}
    except jwt.InvalidTokenError as e:
        return {"statusCode": 403, "body": json.dumps({"error": f"Invalid token: {str(e)}"})}
