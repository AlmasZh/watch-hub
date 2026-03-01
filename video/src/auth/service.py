from .auth_client import auth_grpc_client
from .schemas import User


async def validate_token(access_token: str) -> User | None:
    user_dict = await auth_grpc_client.validate_token(access_token)
    if not user_dict:
        return None
    
    return User.model_validate(user_dict)