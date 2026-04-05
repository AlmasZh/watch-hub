#!/run/current-system/sw/bin/bash

ROOT_DIR=$(pwd)

# 1. Generate for AUTH Service (Auth acts as a client or server)
python -m grpc_tools.protoc \
    -I $ROOT_DIR/protos \
    --python_out=$ROOT_DIR/auth/src/grpc_gen \
    --grpc_python_out=$ROOT_DIR/auth/src/grpc_gen \
    --pyi_out=$ROOT_DIR/auth/src/grpc_gen \
    $ROOT_DIR/protos/auth_service/v1/auth.proto

python -m grpc_tools.protoc \
    -I $ROOT_DIR/protos \
    --python_out=$ROOT_DIR/video/src/grpc_gen \
    --grpc_python_out=$ROOT_DIR/video/src/grpc_gen \
    --pyi_out=$ROOT_DIR/video/src/grpc_gen \
    $ROOT_DIR/protos/auth_service/v1/auth.proto

# 2. Fix Python Import Issues (Crucial Step)
touch $ROOT_DIR/auth/src/grpc_gen/__init__.py
touch $ROOT_DIR/video/src/grpc_gen/__init__.py

echo "✅ gRPC code generated successfully."