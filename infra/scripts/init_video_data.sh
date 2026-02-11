#!/bin/sh

set -e

echo "Running Migrations..."
alembic upgrade head

echo "Starting Application..."
exec "$@"