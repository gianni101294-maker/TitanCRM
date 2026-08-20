from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models

from app.api.routes.auth import router as auth_router
from app.api.routes.customers import router as customers_router
from app.api.routes.users import router as users_router
from app.api.routes.opportunities import (
    router as opportunities_router,
)
from app.api.routes.activities import router as activities_router
from app.api.routes.pipeline import (
    router as pipeline_router,
)
from app.api.routes.dashboard import (
    router as dashboard_router,
)
from app.api.routes.reports import (
    router as reports_router,
)

app = FastAPI(
    title="TitanCRM API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(customers_router)
app.include_router(opportunities_router)
app.include_router(activities_router)
app.include_router(pipeline_router)
app.include_router(dashboard_router)
app.include_router(reports_router)


@app.get("/")
def root():
    return {
        "name": "TitanCRM API",
        "status": "running",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
    }