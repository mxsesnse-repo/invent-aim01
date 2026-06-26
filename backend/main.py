from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from pathlib import Path
from datetime import datetime
import shutil
import uuid
import csv
import io

from database import Base, engine, get_db
import models
from schemas import CustomerCreate, CustomerOut, EnquiryCreate, EnquiryOut, StatusUpdate, InvoiceCreate, InvoiceUpdate, InvoiceOut, PaymentCreate, PaymentOut, NoteCreate

Base.metadata.create_all(bind=engine)

app = FastAPI(title="K2 — KSquare Consultancy API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

ALLOWED_EXTENSIONS = {
    ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".csv", ".txt", ".md",
    ".png", ".jpg", ".jpeg", ".webp", ".svg", ".tif", ".tiff",
    ".zip", ".rar", ".7z",
    ".step", ".stp", ".stl", ".iges", ".igs", ".dwg", ".dxf", ".sldprt", ".sldasm", ".slddrw",
    ".f3d", ".ipt", ".iam", ".prt", ".asm", ".obj", ".3mf",
    ".gbr", ".ger", ".gtl", ".gbl", ".gts", ".gbs", ".gto", ".gbo", ".gko", ".gm1", ".drl", ".xln",
    ".kicad_pcb", ".kicad_sch", ".sch", ".brd", ".pcb", ".dsn", ".cam", ".ipc", ".net", ".bom",
    ".rvt", ".ifc", ".skp", ".pln", ".layout"
}

FILE_CATEGORIES = [
    "Requirement", "Work Done", "CAD File", "Gerber File", "Schematic", "PCB Design",
    "Site Plan", "Drawing", "BOM", "Report", "Image Reference", "Invoice",
    "Payment Proof", "Archive", "Other"
]

def update_invoice_status(invoice: models.Invoice):
    paid = float(invoice.amount_paid or 0)
    total = float(invoice.total_amount or 0)
    invoice.pending_amount = max(total - paid, 0)
    if paid <= 0:
        invoice.status = "Pending"
    elif paid < total:
        invoice.status = "Partially Paid"
    else:
        invoice.status = "Paid"

def csv_response(filename: str, headers: list[str], rows: list[list]):
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(headers)
    writer.writerows(rows)
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "K2 Consultancy API"}

@app.get("/api/file-config")
def file_config():
    return {"categories": FILE_CATEGORIES, "allowed_extensions": sorted(ALLOWED_EXTENSIONS)}

@app.post("/api/customers", response_model=CustomerOut)
def create_customer(payload: CustomerCreate, db: Session = Depends(get_db)):
    customer = models.Customer(**payload.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer

@app.get("/api/customers", response_model=list[CustomerOut])
def list_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).order_by(models.Customer.created_at.desc()).all()

@app.get("/api/customers/{customer_id}", response_model=CustomerOut)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@app.post("/api/enquiries", response_model=EnquiryOut)
def create_enquiry(payload: EnquiryCreate, db: Session = Depends(get_db)):
    enquiry = models.Enquiry(**payload.model_dump())
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)
    return enquiry

@app.get("/api/enquiries", response_model=list[EnquiryOut])
def list_enquiries(db: Session = Depends(get_db)):
    return db.query(models.Enquiry).order_by(models.Enquiry.created_at.desc()).all()

@app.patch("/api/enquiries/{enquiry_id}/status", response_model=EnquiryOut)
def update_enquiry_status(enquiry_id: int, payload: StatusUpdate, db: Session = Depends(get_db)):
    enquiry = db.query(models.Enquiry).filter(models.Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    enquiry.status = payload.status
    db.commit()
    db.refresh(enquiry)
    return enquiry

@app.post("/api/files")
async def upload_project_file(
    category: str = Form(...),
    notes: str = Form(""),
    customer_id: int | None = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type {suffix} not supported")
    stored = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex}{suffix}"
    path = UPLOAD_DIR / stored
    with path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    record = models.ProjectFile(
        customer_id=customer_id,
        category=category,
        original_filename=file.filename or stored,
        stored_filename=stored,
        file_size=path.stat().st_size,
        notes=notes,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {
        "id": record.id,
        "customer_id": record.customer_id,
        "category": record.category,
        "original_filename": record.original_filename,
        "file_size": record.file_size,
        "notes": record.notes,
        "download_url": f"/uploads/{stored}",
        "created_at": record.created_at,
    }

@app.get("/api/files")
def list_files(db: Session = Depends(get_db)):
    rows = db.query(models.ProjectFile).order_by(models.ProjectFile.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "customer_id": r.customer_id,
            "category": r.category,
            "original_filename": r.original_filename,
            "file_size": r.file_size,
            "notes": r.notes,
            "download_url": f"/uploads/{r.stored_filename}",
            "created_at": r.created_at,
        }
        for r in rows
    ]

@app.get("/api/files/{file_id}")
def get_file(file_id: int, db: Session = Depends(get_db)):
    r = db.query(models.ProjectFile).filter(models.ProjectFile.id == file_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="File not found")
    return {
        "id": r.id,
        "customer_id": r.customer_id,
        "category": r.category,
        "original_filename": r.original_filename,
        "file_size": r.file_size,
        "notes": r.notes,
        "download_url": f"/uploads/{r.stored_filename}",
        "created_at": r.created_at,
    }

@app.post("/api/invoices", response_model=InvoiceOut)
def create_invoice(payload: InvoiceCreate, db: Session = Depends(get_db)):
    invoice = models.Invoice(**payload.model_dump())
    update_invoice_status(invoice)
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return invoice

@app.get("/api/invoices", response_model=list[InvoiceOut])
def list_invoices(db: Session = Depends(get_db)):
    return db.query(models.Invoice).order_by(models.Invoice.created_at.desc()).all()

@app.get("/api/invoices/{invoice_id}", response_model=InvoiceOut)
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    invoice = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice

@app.patch("/api/invoices/{invoice_id}", response_model=InvoiceOut)
def update_invoice(invoice_id: int, payload: InvoiceUpdate, db: Session = Depends(get_db)):
    invoice = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(invoice, key, value)
    update_invoice_status(invoice)
    db.commit()
    db.refresh(invoice)
    return invoice

@app.post("/api/payments", response_model=PaymentOut)
def create_payment(payload: PaymentCreate, db: Session = Depends(get_db)):
    payment = models.Payment(**payload.model_dump())
    db.add(payment)
    if payment.invoice_id:
        invoice = db.query(models.Invoice).filter(models.Invoice.id == payment.invoice_id).first()
        if invoice:
            invoice.amount_paid = float(invoice.amount_paid or 0) + float(payment.amount or 0)
            update_invoice_status(invoice)
    db.commit()
    db.refresh(payment)
    return payment

@app.get("/api/payments", response_model=list[PaymentOut])
def list_payments(db: Session = Depends(get_db)):
    return db.query(models.Payment).order_by(models.Payment.created_at.desc()).all()

@app.get("/api/payments/{payment_id}", response_model=PaymentOut)
def get_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@app.post("/api/requirement-notes")
def create_requirement_note(payload: NoteCreate, db: Session = Depends(get_db)):
    note = models.RequirementNote(customer_id=payload.customer_id, title=payload.title, note=payload.note)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@app.post("/api/work-notes")
def create_work_note(payload: NoteCreate, db: Session = Depends(get_db)):
    note = models.WorkNote(customer_id=payload.customer_id, title=payload.title, note=payload.note, status=payload.status or "In Progress")
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@app.get("/api/dashboard")
def dashboard(db: Session = Depends(get_db)):
    total_billed = db.query(func.coalesce(func.sum(models.Invoice.total_amount), 0)).scalar()
    total_paid = db.query(func.coalesce(func.sum(models.Invoice.amount_paid), 0)).scalar()
    pending = db.query(func.coalesce(func.sum(models.Invoice.pending_amount), 0)).scalar()
    domains = db.query(models.Customer.work_domain, func.count(models.Customer.id)).group_by(models.Customer.work_domain).all()
    return {
        "customers": db.query(models.Customer).count(),
        "enquiries": db.query(models.Enquiry).count(),
        "files": db.query(models.ProjectFile).count(),
        "invoices": db.query(models.Invoice).count(),
        "payments": db.query(models.Payment).count(),
        "total_billed": total_billed,
        "total_paid": total_paid,
        "pending_payment": pending,
        "domains": [{"domain": d or "Unspecified", "count": c} for d, c in domains],
    }

@app.get("/api/export/customers.csv")
def export_customers(db: Session = Depends(get_db)):
    rows = db.query(models.Customer).all()
    return csv_response("customers.csv", ["Customer ID","Name","Email","Phone","Organization","City","Work Domain","Created Date"],
                        [[r.id,r.full_name,r.email,r.phone,r.organization,r.city,r.work_domain,r.created_at] for r in rows])

@app.get("/api/export/enquiries.csv")
def export_enquiries(db: Session = Depends(get_db)):
    rows = db.query(models.Enquiry).all()
    return csv_response("enquiries.csv", ["Enquiry ID","Name","Email","Industry","Service Required","Project Stage","Status","Created Date"],
                        [[r.id,r.full_name,r.email,r.industry,r.service_required,r.project_stage,r.status,r.created_at] for r in rows])

@app.get("/api/export/invoices.csv")
def export_invoices(db: Session = Depends(get_db)):
    rows = db.query(models.Invoice).all()
    return csv_response("invoices.csv", ["Invoice ID","Invoice Number","Customer","Title","Total Amount","Amount Paid","Pending Amount","Status","Created Date"],
                        [[r.id,r.invoice_number,r.customer_id,r.title,r.total_amount,r.amount_paid,r.pending_amount,r.status,r.created_at] for r in rows])

@app.get("/api/export/payments.csv")
def export_payments(db: Session = Depends(get_db)):
    rows = db.query(models.Payment).all()
    return csv_response("payments.csv", ["Payment ID","Invoice ID","Customer Email","Amount","Payment Mode","Reference","Status","Created Date"],
                        [[r.id,r.invoice_id,r.customer_email,r.amount,r.payment_mode,r.reference,r.status,r.created_at] for r in rows])
