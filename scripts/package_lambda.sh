#!/bin/bash

set -e

# get function name
FUNCTION_NAME="$1"
LAMBDA_DIR="lambda/$FUNCTION_NAME"
ZIP_FILE="$LAMBDA_DIR/${FUNCTION_NAME}.zip"

# check handler.py exists or not
if [ ! -f "$LAMBDA_DIR/handler.py" ]; then
  echo "❌ handler.py not found in $LAMBDA_DIR"
  exit 1
fi

echo "📦 Packaging Lambda function: $FUNCTION_NAME"

rm -f "$ZIP_FILE"

cd "$LAMBDA_DIR"

# check if needs to pack dependencies
if [ -f "requirements.txt" ]; then
  echo "📦 Installing dependencies from requirements.txt"
  mkdir -p temp_package
  pip install -r requirements.txt -t temp_package

  echo "📦 Zipping handler.py and dependencies..."
  cd temp_package
  zip -r9 "../${FUNCTION_NAME}.zip" .
  cd ..
  zip -g "${FUNCTION_NAME}.zip" handler.py

  rm -rf temp_package
else
  echo "📦 Zipping handler.py only (no dependencies)"
  zip "${FUNCTION_NAME}.zip" handler.py
fi

echo "✅ Done: ${ZIP_FILE}"