from fastapi import FastAPI

app = FastAPI(
    title="Titan CRM API",
    description="API del sistema Titan CRM",
    version="0.1.0"
)

@app.get("/")
def root():
    return {
        "message": "¡Bienvenido a Titan CRM!"
    }

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "Titan CRM",
        "version": "0.1.0"
    }