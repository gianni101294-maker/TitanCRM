from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.user import User


def get_user_by_email(db: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return db.scalar(statement)


def create_user(
    db: Session,
    *,
    full_name: str,
    email: str,
    hashed_password: str,
    role: str = "user",
) -> User:
    user = User(
        full_name=full_name,
        email=email,
        hashed_password=hashed_password,
        role=role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user
def get_all_users(db: Session) -> list[User]:
    statement = select(User).order_by(User.id)
    return list(db.scalars(statement).all())
def get_all_users(db: Session) -> list[User]:
    statement = select(User).order_by(User.id)
    return list(db.scalars(statement).all())