"""normalize customer created at timezone

Revision ID: 6f47d2fe32a6
Revises: 63492320c1bd
Create Date: 2026-09-02 16:22:27.365719
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "6f47d2fe32a6"
down_revision: Union[str, Sequence[str], None] = "63492320c1bd"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Convert legacy naive UTC timestamps to timezone-aware timestamps."""

    op.alter_column(
        "customers",
        "created_at",
        existing_type=sa.DateTime(timezone=False),
        type_=sa.DateTime(timezone=True),
        existing_nullable=False,
        server_default=sa.text("now()"),
        postgresql_using="created_at AT TIME ZONE 'UTC'",
    )


def downgrade() -> None:
    """Convert timezone-aware timestamps back to naive UTC timestamps."""

    op.alter_column(
        "customers",
        "created_at",
        existing_type=sa.DateTime(timezone=True),
        type_=sa.DateTime(timezone=False),
        existing_nullable=False,
        server_default=None,
        postgresql_using="created_at AT TIME ZONE 'UTC'",
    )
