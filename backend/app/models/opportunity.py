from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.database.base import Base


class Opportunity(Base):
    __tablename__ = "opportunities"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    value: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    stage: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="prospect",
    )

    customer_id: Mapped[int] = mapped_column(
        ForeignKey("customers.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    customer = relationship(
        "Customer",
        back_populates="opportunities",
    )