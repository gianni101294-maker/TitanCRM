from sqlalchemy import select

from app.core.security import hash_password
from app.database.session import SessionLocal
from app.models.user import User


ADMIN_EMAIL = "admin@titancrm.com"
ADMIN_PASSWORD = "TitanCRM123"


def create_admin() -> None:
    db = SessionLocal()

    try:
        existing_admin = db.scalar(
            select(User).where(
                User.email == ADMIN_EMAIL,
            ),
        )

        if existing_admin:
            print(
                "El administrador ya existe:",
                existing_admin.email,
            )
            return

        admin = User(
            full_name="Administrador TitanCRM",
            email=ADMIN_EMAIL,
            hashed_password=hash_password(
                ADMIN_PASSWORD,
            ),
            role="admin",
            is_active=True,
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print("Administrador creado correctamente.")
        print(f"ID: {admin.id}")
        print(f"Correo: {admin.email}")
        print(f"Rol: {admin.role}")

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()