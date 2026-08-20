from datetime import datetime
from datetime import timedelta
from datetime import timezone
from typing import Any

import jwt
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash

from app.core.config import settings


password_hash = PasswordHash.recommended()


def hash_password(
    password: str,
) -> str:
    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return password_hash.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(
    subject: str | int,
    expires_delta: timedelta | None = None,
    extra_claims: dict[str, Any] | None = None,
) -> str:
    now = datetime.now(
        timezone.utc,
    )

    expires_at = (
        now + expires_delta
        if expires_delta is not None
        else now
        + timedelta(
            minutes=(
                settings.ACCESS_TOKEN_EXPIRE_MINUTES
            ),
        )
    )

    payload: dict[str, Any] = {
        "sub": str(subject),
        "iat": now,
        "exp": expires_at,
    }

    if extra_claims:
        payload.update(
            extra_claims,
        )

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def decode_access_token(
    token: str,
) -> dict[str, Any] | None:
    try:
        return jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[
                settings.ALGORITHM,
            ],
            options={
                "require": [
                    "sub",
                    "iat",
                    "exp",
                ],
            },
        )
    except InvalidTokenError:
        return None