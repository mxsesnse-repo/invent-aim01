# Deployment Guide

## Backend

```bash
cd backend
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

Linux:

```bash
source .venv/bin/activate
```

Install and run:

```bash
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Production Build

```bash
cd frontend
npm run build
```

Deploy `frontend/dist` with Nginx/Apache or a static hosting service. Run the FastAPI backend behind a process manager and reverse proxy.

## Security Before Public Deployment

This MVP uses open admin/customer pages. Before public use:

- Add authentication for Admin Dashboard and Customer Portal.
- Add password hashing, JWT/session handling and role-based access.
- Restrict CORS to the real frontend domain.
- Add upload size limits and file scanning.
- Use HTTPS.
- Move secrets/config to environment variables.
