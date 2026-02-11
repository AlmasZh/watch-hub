"""seed_genres_table

Revision ID: 36b8b0093cce
Revises: 17b6cb46abbb
Create Date: 2026-02-11 17:01:06.066877

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer

# revision identifiers, used by Alembic.
revision: str = '36b8b0093cce'
down_revision: Union[str, None] = '17b6cb46abbb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Define a temporary table representation. 
    # This prevents the migration from breaking if you change the 'Genre' model in the future.
    genres_table = table(
        'genres',
        column('id', Integer),
        column('name', String)
    )

    # 2. List of genres to insert
    # We do not specify 'id' here, assuming the database (Postgres) 
    # handles the auto-increment/serial PK.
    initial_genres = [
        {'name': 'Action'},
        {'name': 'Adventure'},
        {'name': 'Animation'},
        {'name': 'Comedy'},
        {'name': 'Crime'},
        {'name': 'Documentary'},
        {'name': 'Drama'},
        {'name': 'Family'},
        {'name': 'Fantasy'},
        {'name': 'History'},
        {'name': 'Horror'},
        {'name': 'Music'},
        {'name': 'Mystery'},
        {'name': 'Romance'},
        {'name': 'Sci-Fi'},
        {'name': 'Thriller'},
        {'name': 'War'},
        {'name': 'Western'},
    ]

    # 3. Perform the bulk insert
    op.bulk_insert(genres_table, initial_genres)


def downgrade() -> None:
    # Remove the genres we added if we need to rollback
    op.execute("DELETE FROM genres")
    # Alternatively, if you want to be specific and keep user-added genres:
    # op.execute("DELETE FROM genres WHERE name IN ('Action', 'Adventure', ...)")
