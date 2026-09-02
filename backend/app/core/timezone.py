from datetime import UTC, datetime
from zoneinfo import ZoneInfo

from app.core.config import settings


BUSINESS_TIMEZONE = ZoneInfo(
    settings.BUSINESS_TIMEZONE
)


def business_now() -> datetime:
    """Return the current time in the configured business timezone."""

    return datetime.now(BUSINESS_TIMEZONE)


def to_business_timezone(
    value: datetime,
) -> datetime:
    """Convert a datetime to the configured business timezone.

    Legacy naive datetimes are interpreted as UTC.
    """

    if value.tzinfo is None:
        value = value.replace(tzinfo=UTC)

    return value.astimezone(
        BUSINESS_TIMEZONE
    )
