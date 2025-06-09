#!/bin/bash
# cmd line like: bash scripts/package_lambda.sh create_event
set -e

# get function name
FUNCTION_NAME="$1"

SRC_DIR="lambda_src/$FUNCTION_NAME"
ZIP_PATH="$SRC_DIR/${FUNCTION_NAME}.zip"

if [ ! -f "$SRC_DIR/handler.py" ]; then
  echo "❌ handler.py not found in $SRC_DIR"
  exit 1
fi

echo "📦 Packaging Lambda function: $FUNCTION_NAME"

rm -f "$ZIP_PATH"

cd "$SRC_DIR"

# check if needs to pack dependencies
if [ -f "requirements.txt" ]; then
  echo "📦 Installing dependencies from requirements.txt"
  mkdir -p temp_package
  pip install -r requirements.txt -t temp_package

  echo "📦 Zipping handler and dependencies..."
  cd temp_package
  zip -r9 "../${FUNCTION_NAME}.zip" . > /dev/null
  cd ..
  zip -g "${FUNCTION_NAME}.zip" handler.py > /dev/null
  rm -rf temp_package
else
  echo "📦 Zipping handler.py only (no dependencies)"
  zip "${FUNCTION_NAME}.zip" handler.py > /dev/null
fi

echo "✅ Done: $ZIP_PATH"