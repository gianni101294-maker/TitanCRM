from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.base import Base


class OpportunityEvent(Base):
    __tablename__ = "opportunity_events"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    opportunity_id: Mapped[int] = mapped_column(
        ForeignKey(
            "opportunities.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    event_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    user_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    opportunity = relationship(
        "Opportunity",
        back_populates="events",
    )
