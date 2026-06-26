from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class CustomerCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    organization: Optional[str] = None
    city: Optional[str] = None
    work_domain: Optional[str] = None
    service_required: Optional[str] = None
    requirement_notes: Optional[str] = None
    updated_notes: Optional[str] = None
    project_status: Optional[str] = "New"

class CustomerOut(CustomerCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class EnquiryCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    organization: Optional[str] = None
    city: Optional[str] = None
    industry: Optional[str] = None
    service_required: Optional[str] = None
    project_stage: Optional[str] = None
    timeline: Optional[str] = None
    budget_range: Optional[str] = None
    preferred_contact_mode: Optional[str] = None
    need_payment_link: Optional[str] = None
    project_description: str

class EnquiryOut(EnquiryCreate):
    id: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class StatusUpdate(BaseModel):
    status: str

class InvoiceCreate(BaseModel):
    customer_id: Optional[int] = None
    invoice_number: str
    title: str
    total_amount: float
    amount_paid: float = 0
    notes: Optional[str] = None

class InvoiceUpdate(BaseModel):
    title: Optional[str] = None
    total_amount: Optional[float] = None
    amount_paid: Optional[float] = None
    notes: Optional[str] = None

class InvoiceOut(InvoiceCreate):
    id: int
    pending_amount: float
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class PaymentCreate(BaseModel):
    invoice_id: Optional[int] = None
    customer_email: Optional[EmailStr] = None
    amount: float
    payment_mode: Optional[str] = None
    reference: Optional[str] = None
    notes: Optional[str] = None

class PaymentOut(PaymentCreate):
    id: int
    status: str
    screenshot_filename: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

class NoteCreate(BaseModel):
    customer_id: Optional[int] = None
    title: str
    note: str
    status: Optional[str] = "In Progress"
