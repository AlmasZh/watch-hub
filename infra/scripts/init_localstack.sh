#!/usr/bin/env bash
echo "LocalStack is ready. Initializing S3 bucket..."

awslocal s3 mb s3://my-test-bucket --region us-east-1

awslocal s3api put-bucket-cors \
  --bucket my-test-bucket \
  --cors-configuration file:///tmp/cors-config.json

echo "S3 bucket initialization complete."