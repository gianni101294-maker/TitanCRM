"""add loss reason to opportunities

Revision ID: c7b9e2a4f631
Revises: 02f445557e18
Create Date: 2026-10-05
"""

from typing import (
    Sequence,
    Union,
)

from alembic import op
import sqlalchemy as sa


revision: str = "c7b9e2a4f631"

down_revision: Union[
    str,
    Sequence[str],
    None,
] = "02f445557e18"

branch_labels: Union[
    str,
    Sequence[str],
    None,
] = None

depends_on: Union[
    str,
    Sequence[str],
    None,
] = None


def upgrade() -> None:
    op.add_column(
        "opportunities",
        sa.Column(
            "loss_reason",
            sa.String(
                length=50,
            ),
            nullable=True,
        ),
    )

    op.add_column(
        "opportunities",
        sa.Column(
            "loss_reason_detail",
            sa.Text(),
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_column(
        "opportunities",
        "loss_reason_detail",
    )

    op.drop_column(
        "opportunities",
        "loss_reason",
    )