from sqlalchemy import text

from backend.app.database.database import engine

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version();"))

        print("=================================")
        print("Conexión exitosa a PostgreSQL")
        print(result.scalar())
        print("=================================")

except Exception as error:
    print("Error al conectar con PostgreSQL:")
    print(error)