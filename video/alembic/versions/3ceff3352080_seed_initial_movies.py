"""seed_initial_movies

Revision ID: 3ceff3352080
Revises: 2400476bb5a0
Create Date: 2026-02-16 15:40:56.887605

"""
import uuid
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '3ceff3352080'
down_revision: str | Sequence[str] | None = '2400476bb5a0'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # 1. Define temporary table representations to avoid importing app models
    media_table = sa.table(
        'media',
        sa.column('id', UUID(as_uuid=True)),
        sa.column('title', sa.String),
        sa.column('description', sa.Text),
        sa.column('original_file_name', sa.String),
        sa.column('storage_key', sa.String),
        sa.column('stream_url', sa.String),
        sa.column('thumbnail_url', sa.String),
        sa.column('duration_seconds', sa.Integer),
        sa.column('status', sa.String),
        sa.column('created_at', sa.DateTime),
        sa.column('updated_at', sa.DateTime),
        sa.column('type', sa.String), # Polymorphic discriminator
    )

    movies_table = sa.table(
        'movies',
        sa.column('id', UUID(as_uuid=True)),
        sa.column('release_year', sa.Integer),
        sa.column('director', sa.String),
        sa.column('rating', sa.Float),
        sa.column('poster_url', sa.String),
    )

    # 2. Prepare the data
    # Status 'ready' matches MediaStatus.READY
    # Type 'movie' matches polymorphic_identity

    movie_data = [
        {
            "title": "Inception",
            "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
            "original_file_name": "inception.mp4",
            "storage_key": "s3://amzn-wt-project-movies/inception.mp4",
            "stream_url": "https://d24lanzu8wxnoe.cloudfront.net/inception/inception.m3u8",
            "thumbnail_url": "https://dk3at0kil7p4c.cloudfront.net/thumbnails/inception_thumbnail.jpg",
            "poster_url": "https://dk3at0kil7p4c.cloudfront.net/posters/inception_poster.jpg",
            "duration_seconds": 8880, # 2h 28m
            "release_year": 2010,
            "director": "Christopher Nolan",
            "rating": 8.8,
        },
        {
            "title": "John Wick",
            "description": "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him.",
            "original_file_name": "john_wick.mp4",
            "storage_key": "s3://amzn-wt-project-movies/john_wick.mp4",
            # Note: User specified this is at the root
            "stream_url": "https://d24lanzu8wxnoe.cloudfront.net/john_wick.m3u8",
            "thumbnail_url": "https://dk3at0kil7p4c.cloudfront.net/thumbnails/john_wick_thumbnail.jpg",
            "poster_url": "https://dk3at0kil7p4c.cloudfront.net/posters/john_wick_poster.jpg",
            "duration_seconds": 6060, # 1h 41m
            "release_year": 2014,
            "director": "Chad Stahelski",
            "rating": 7.4,
        },
        {
            "title": "Mad Max: Fury Road",
            "description": "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.",
            "original_file_name": "mad_max.mp4",
            "storage_key": "s3://amzn-wt-project-movies/mad_max.mp4",
            "stream_url": "https://d24lanzu8wxnoe.cloudfront.net/mad_max/mad_max.m3u8",
            "thumbnail_url": "https://dk3at0kil7p4c.cloudfront.net/thumbnails/mad_max_thumbnail.jpg",
            "poster_url": "https://dk3at0kil7p4c.cloudfront.net/posters/mad-max-fury-road-poster.webp",
            "duration_seconds": 7200, # 2h 0m
            "release_year": 2015,
            "director": "George Miller",
            "rating": 8.1,
        },
        {
            "title": "The Dark Knight",
            "description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            "original_file_name": "the_dark_knight.mp4",
            "storage_key": "s3://amzn-wt-project-movies/the_dark_knight.mp4",
            "stream_url": "https://d24lanzu8wxnoe.cloudfront.net/the_dark_knight/the_dark_knight.m3u8",
            "thumbnail_url": "https://dk3at0kil7p4c.cloudfront.net/thumbnails/the_dark_knight_thumbnail.jpg",
            "poster_url": "https://dk3at0kil7p4c.cloudfront.net/posters/the_dark_knight_poster.jpg",
            "duration_seconds": 9120, # 2h 32m
            "release_year": 2008,
            "director": "Christopher Nolan",
            "rating": 9.0,
        }
    ]

    # 3. Insert logic
    # We iterate manually because we need to share the generated UUID between the two tables
    for movie in movie_data:
        media_id = uuid.uuid4()

        # Insert Parent (Media)
        op.execute(
            media_table.insert().values(
                id=media_id,
                title=movie["title"],
                description=movie["description"],
                original_file_name=movie["original_file_name"],
                storage_key=movie["storage_key"],
                stream_url=movie["stream_url"],
                thumbnail_url=movie["thumbnail_url"],
                duration_seconds=movie["duration_seconds"],
                status="ready",  # MediaStatus.READY
                type="movie",    # polymorphic_identity
            )
        )

        # Insert Child (Movie)
        op.execute(
            movies_table.insert().values(
                id=media_id,
                release_year=movie["release_year"],
                director=movie["director"],
                rating=movie["rating"],
                poster_url=movie["poster_url"]
            )
        )


def downgrade() -> None:
    # Delete based on the unique storage keys we just added
    # We delete from 'movies' first, then 'media' to respect foreign keys
    # (though CASCADE might handle it depending on DB config, explicit is safer in migration)

    storage_keys = [
        "s3://amzn-wt-project-movies/inception.mp4",
        "s3://amzn-wt-project-movies/john_wick.mp4",
        "s3://amzn-wt-project-movies/mad_max.mp4",
        "s3://amzn-wt-project-movies/the_dark_knight.mp4"
    ]

    # We need to find the IDs first to delete from the child table
    connection = op.get_bind()
    media_table = sa.table(
        'media',
        sa.column('id', UUID(as_uuid=True)),
        sa.column('storage_key', sa.String)
    )
    movies_table = sa.table(
        'movies',
        sa.column('id', UUID(as_uuid=True))
    )

    # Fetch IDs
    results = connection.execute(
        sa.select(media_table.c.id).where(media_table.c.storage_key.in_(storage_keys))
    ).fetchall()

    ids_to_delete = [row[0] for row in results]

    if ids_to_delete:
        # Delete from child table (movies)
        op.execute(
            movies_table.delete().where(movies_table.c.id.in_(ids_to_delete))
        )

        # Delete from parent table (media)
        op.execute(
            media_table.delete().where(media_table.c.id.in_(ids_to_delete))
        )
