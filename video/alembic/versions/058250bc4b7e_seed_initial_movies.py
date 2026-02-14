"""seed_initial_movies

Revision ID: 058250bc4b7e
Revises: 36b8b0093cce
Create Date: 2026-02-12 16:33:41.158537

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '058250bc4b7e'
down_revision: Union[str, Sequence[str], None] = '36b8b0093cce'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
