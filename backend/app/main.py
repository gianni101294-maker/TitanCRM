from fastapi import FastAPI

from backend.app.api.users import router as users_router


app = FastAPI(
    title="Titan CRM API",
    version="1.0.0",
)


app.include_router(users_router)


@app.get("/")
def root():
    return {
        "message": "Titan CRM API funcionando",
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
    }