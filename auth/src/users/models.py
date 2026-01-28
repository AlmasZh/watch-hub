from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Date

from ..models import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    display_name: Mapped[str] = mapped_column(String(100))
    picture: Mapped[str | None] = mapped_column(nullable=True)
    password: Mapped[str | None] = mapped_column(String(10000), nullable=True)
    date_of_birth: Mapped[Date | None] = mapped_column(Date, nullable=True)