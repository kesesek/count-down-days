#!/bin/bash
set -e

# 📌 Usage: bash scripts/package_lambda.sh create_event
FUNCTION_NAME="$1"
SRC_DIR="lambda_src/$FUNCTION_NAME"
ZIP_FILE="${FUNCTION_NAME}.zip"
ZIP_PATH="$SRC_DIR/$ZIP_FILE"

# 🔍 Check if handler.py exists
if [ ! -f "$SRC_DIR/handler.py" ]; then
  echo "❌ handler.py not found in $SRC_DIR"
  exit 1
fi

echo "📦 Packaging Lambda function: $FUNCTION_NAME"
rm -f "$ZIP_PATH"

pushd "$SRC_DIR" > /dev/null

# 🧪 If requirements.txt exists, use Docker to build dependencies
if [ -f "requirements.txt" ]; then
  echo "📦 Detected requirements.txt. Building with Docker..."

  mkdir -p temp_package

  docker run --rm \
    -v "$PWD":/var/task \
    public.ecr.aws/sam/build-python3.9 \
    bash -c "pip install -r requirements.txt -t temp_package"

  pushd temp_package > /dev/null
  zip -r9 "../$ZIP_FILE" . > /dev/null
  popd > /dev/null

  zip -g "$ZIP_FILE" handler.py > /dev/null
  rm -rf temp_package
else
  echo "📦 No requirements.txt found. Zipping handler.py only..."
  zip "$ZIP_FILE" handler.py > /dev/null
fi

popd > /dev/null
echo "✅ Done: $ZIP_PATH"
du -h "$ZIP_PATH"

# 🚨 Remove outdated policy attachment from Terraform state
echo "🧹 Cleaning Terraform state (if needed)..."

if [[ "$FUNCTION_NAME" == "create_event" ]]; then
  terraform state rm module.lambda_create_event.aws_iam_policy_attachment.lambda_logs || true
elif [[ "$FUNCTION_NAME" == "get_events" ]]; then
  terraform state rm module.lambda_get_events.aws_iam_policy_attachment.lambda_logs_get_events || true
else
  echo "ℹ️ No matching state cleanup rule for $FUNCTION_NAME"
fi

echo "✅ Lambda '$FUNCTION_NAME' packaged and state cleaned."

# cmd line like: bash scripts/package_lambda.sh create_event