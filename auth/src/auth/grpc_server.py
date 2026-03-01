import grpc
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.grpc_gen.auth_service import auth_pb2, auth_pb2_grpc

from src.users.models import User
from src.database import new_session
from src.auth.utils import get_current_token_payload_grpc
from .exceptions import TokenExpiredError, TokenInvalidError
from src.config import settings


class AuthService(auth_pb2_grpc.AuthServiceServicer):
    async def _get_user(self, session: AsyncSession, user_id: int):
        stmt = select(User).where(User.id == user_id)
        res = await session.execute(stmt)
        return res.scalar_one_or_none()

    async def GetUserById(self, request, context: grpc.aio.ServicerContext) -> auth_pb2.UserResponse:
        async with new_session() as session:
            user_id = request.user_id

            user = await self._get_user(session, user_id)
            if not user:
                await context.abort(grpc.StatusCode.NOT_FOUND, details=f"User {request.user_id} not found")
            message = self._model_to_message(user)
            return message

    async def ValidateToken(self, request, context: grpc.aio.ServicerContext) -> auth_pb2.UserResponse:
        try:
            payload = await get_current_token_payload_grpc(request.token)
        except TokenExpiredError:
            await context.abort(grpc.StatusCode.UNAUTHENTICATED, details=f"Token has expired")
        except TokenInvalidError:
            await context.abort(grpc.StatusCode.UNAUTHENTICATED, details="Invalid token")

        try:
            user_id = int(payload.sub)
        except (ValueError, TypeError):
            await context.abort(grpc.StatusCode.UNAUTHENTICATED, details="Invalid token subject")
        
        async with new_session() as session:
            user = await self._get_user(session, user_id)

            if not user:
                await context.abort(grpc.StatusCode.UNAUTHENTICATED, details=f"User no longer exists")

            return self._model_to_message(user)
    
    def _model_to_message(self, user: User) -> auth_pb2.UserResponse:
        return auth_pb2.UserResponse(
            id=user.id,
            email=user.email,
            username=user.username,
            display_name=user.display_name or "",
            picture=user.picture or "",
            date_of_birth=user.date_of_birth.isoformat() if user.date_of_birth else ""
        )

async def start_grpc_server():
    server = grpc.aio.server()
    auth_pb2_grpc.add_AuthServiceServicer_to_server(AuthService(), server)

    listen_addr = settings.GRPC_ADDR
    server.add_insecure_port(listen_addr)
    print(f"🚀 Auth gRPC Server starting on {listen_addr}")

    await server.start()
    return server