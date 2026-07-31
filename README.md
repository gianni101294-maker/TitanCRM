# 🚀 TitanCRM

![Python](https://img.shields.io/badge/Python-3.13-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.139-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Coverage](https://img.shields.io/badge/Coverage-91%25-brightgreen)
![Tests](https://img.shields.io/badge/Tests-12-success)

Un CRM (Customer Relationship Management) desarrollado con **FastAPI**, **PostgreSQL** y **Docker**, diseñado para gestionar clientes, oportunidades comerciales y actividades, siguiendo una arquitectura limpia y buenas prácticas de desarrollo.

---

# 📌 Características

- 🔐 Autenticación mediante JWT.
- 👥 Gestión de usuarios.
- 🏢 Gestión de clientes.
- 💼 Gestión de oportunidades.
- 📅 Gestión de actividades.
- 📊 Dashboard con métricas del negocio.
- 📈 Pipeline comercial.
- 🧪 Pruebas automatizadas con Pytest.
- 📊 Cobertura de pruebas superior al 90%.
- 🐳 Docker y Docker Compose.
- ⚙️ Integración continua con GitHub Actions.

---

# 🛠 Tecnologías

| Tecnología | Uso |
|------------|-----|
| Python 3.13 | Lenguaje principal |
| FastAPI | API REST |
| SQLAlchemy | ORM |
| Alembic | Migraciones |
| PostgreSQL | Base de datos |
| JWT | Autenticación |
| Docker | Contenedores |
| Pytest | Pruebas |
| Ruff | Calidad de código |
| GitHub Actions | Integración Continua |

---

## ⚙️ Instalación

Clona el repositorio:

```bash
git clone https://github.com/gianni101294-maker/TitanCRM.git
```

Entra al proyecto:

```bash
cd TitanCRM
```

Instala las dependencias:

```bash
pip install -r backend/requirements.txt
```

Configura las variables de entorno en un archivo `.env`.

Ejecuta las migraciones:

```bash
alembic upgrade head
```

Inicia la aplicación:

```bash
uvicorn backend.app.main:app --reload
```

# 🏗 Arquitectura

```
backend/
│
├── api/
├── auth/
├── core/
├── database/
├── models/
├── repositories/
├── schemas/
├── services/
└── tests/
```

La aplicación sigue una arquitectura por capas:

- API
- Servicios
- Repositorios
- Base de datos

---

# 🚀 Ejecución con Docker

```bash
docker compose up --build
```

Swagger:

```
http://localhost:8000/docs
```

---

# 🧪 Ejecutar pruebas

```bash
pytest -v
```

Cobertura:

```bash
pytest --cov=backend/app --cov-report=term-missing
```

---

# 📊 Calidad del proyecto

Actualmente el proyecto cuenta con:

- ✅ 12 pruebas automatizadas
- ✅ 91% de cobertura
- ✅ Ruff
- ✅ GitHub Actions
- ✅ Docker

---

# 📚 API

La documentación interactiva está disponible en:

```
http://localhost:8000/docs
```

---

## 🏛 Flujo de la aplicación

```text
Cliente
   │
   ▼
FastAPI
   │
API
   │
Servicios
   │
Repositorios
   │
SQLAlchemy
   │
PostgreSQL
```

# 📌 Roadmap

- [x] Autenticación JWT
- [x] CRUD de Usuarios
- [x] CRUD de Clientes
- [x] CRUD de Oportunidades
- [x] CRUD de Actividades
- [x] Dashboard
- [x] Pipeline
- [x] Docker
- [x] GitHub Actions
- [x] Cobertura >90%
- [ ] Despliegue en la nube
- [ ] Frontend web

---

# 👨‍💻 Autor

**Gianni Rivera**

Proyecto desarrollado como parte de mi portafolio de Ingeniería Mecatrónica y desarrollo de software.