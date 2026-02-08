#!/bin/sh

if [ -f /run/secrets/jwt_public ]; then
    export JWT_PUBLIC_KEY="$(cat /run/secrets/jwt_public )"
fi

exec "$@"