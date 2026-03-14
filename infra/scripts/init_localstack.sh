#!/usr/bin/env bash
set -euo pipefail

echo "LocalStack is ready. Initializing S3 bucket..."

if awslocal s3api head-bucket --bucket my-test-bucket 2>/dev/null; then
  echo "Bucket my-test-bucket already exists."
else
  echo "Creating bucket my-test-bucket..."
  awslocal s3 mb s3://my-test-bucket --region us-east-1
fi

awslocal s3api put-bucket-cors \
  --bucket my-test-bucket \
  --cors-configuration file:///tmp/cors-config.json

echo "S3 bucket initialization complete."