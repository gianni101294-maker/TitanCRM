from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.database.base import Base


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    company_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    contact_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    phone: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )
    opportunities = relationship(
    "Opportunity",
    back_populates="customer",
    cascade="all, delete-orphan",
    
)
    activities = relationship(
    "Activity",
    back_populates="customer",
    cascade="all, delete-orphan",
)