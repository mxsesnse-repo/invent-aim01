# K2 — KSquare Consultancy Website

Deployment-ready MVP website repository for **K2 — KSquare Consultancy** under **MxSense Telingent Solutions Pvt. Ltd.**

Website domain: **mxs-technologies.com**  
Location: **IITM Research Park, Chennai**

## Tech Stack

- Backend: Python FastAPI
- Database: SQLite
- ORM: SQLAlchemy
- Frontend: HTML + CSS + TypeScript + Vite
- File Upload Storage: Local `backend/uploads/`
- Packaging: ZIP

## Features

- Futuristic premium business landing page
- About Kartik page
- Services page with all consultancy services
- Industries page
- Visual gallery using images generated in this chat
- Customer account page
- Requirement notes and work done notes
- File upload system for DOCX, PDF, PPT, CAD, Gerber, schematic, PCB, site plan and image files
- Payment and invoice system
- Admin dashboard
- Total billed, total paid and pending payment status
- CSV exports
- SQLite persistence

## Folder Structure

```text
k2-consultancy-website/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   ├── uploads/
│   └── k2_consultancy.db
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│       ├── main.ts
│       ├── styles.css
│       ├── api.ts
│       ├── routes.ts
│       ├── data/
│       ├── components/
│       └── assets/images/
├── docs/
└── README.md
```

## Backend Setup

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

Install:

```bash
pip install -r requirements.txt
```

Run:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend docs:

```text
http://localhost:8000/docs
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Supported File Types

Documents:

```text
.pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .csv, .txt, .md
```

Images:

```text
.png, .jpg, .jpeg, .webp, .svg, .tif, .tiff
```

Archives:

```text
.zip, .rar, .7z
```

CAD:

```text
.step, .stp, .stl, .iges, .igs, .dwg, .dxf, .sldprt, .sldasm, .slddrw,
.f3d, .ipt, .iam, .prt, .asm, .obj, .3mf
```

Gerber / PCB:

```text
.gbr, .ger, .gtl, .gbl, .gts, .gbs, .gto, .gbo, .gko, .gm1, .drl, .xln
```

Schematic / EDA:

```text
.kicad_pcb, .kicad_sch, .sch, .brd, .pcb, .dsn, .cam, .ipc, .net, .bom
```

Site Plan / Layout:

```text
.rvt, .ifc, .skp, .pln, .layout
```

## Security Notes

This is an MVP website. Before public deployment:

- Add authentication for Admin Dashboard and Customer Portal.
- Add proper user login, password hashing, JWT/session handling and role-based access.
- Add file scanning and upload size limits.
- Restrict CORS to the production frontend domain.
- Use HTTPS.
- Review legal pages with a qualified advisor.
