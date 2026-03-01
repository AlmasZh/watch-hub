import grpc

from src.grpc_gen.auth_service import auth_pb2, auth_pb2_grpc
from src.config import settings


class AuthGrpcClient:
    def __init__(self):
        self.channel: grpc.aio.Channel | None = None
        self.stub: auth_pb2_grpc.AuthServiceStub | None = None

    def connect(self):
        self.channel = grpc.aio.insecure_channel(settings.grpc_addr)
        self.stub = auth_pb2_grpc.AuthServiceStub(self.channel)

    async def close(self):
        if self.channel:
            await self.channel.close()
    
    async def validate_token(self, token: str):
        if self.stub is None:
            raise RuntimeError("AuthGrpcClient is not connected. Call connect() before validate_token().")
        try:
            request = auth_pb2.ValidateTokenRequest(token=token)
            response = await self.stub.ValidateToken(request)
            return {
                "id": response.id,
            }
        except grpc.RpcError as e:
            if e.code() == grpc.StatusCode.UNAUTHENTICATED:
                return None
            print(f"gRPC Error: {e}")
            raise

auth_grpc_client = AuthGrpcClient()