from fastapi import FastAPI

from backend.app.api.activities import router as activities_router
from backend.app.api.auth import router as auth_router
from backend.app.api.customers import router as customers_router
from backend.app.api.dashboard import router as dashboard_router
from backend.app.api.opportunities import router as opportunities_router
from backend.app.api.pipeline import router as pipeline_router
from backend.app.api.users import router as users_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Titan CRM API",
    version="1.0.0",
)

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(auth_router)
app.include_router(customers_router)
app.include_router(opportunities_router)
app.include_router(pipeline_router)
app.include_router(dashboard_router)
app.include_router(activities_router)

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