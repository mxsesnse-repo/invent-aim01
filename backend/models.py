from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(160), nullable=False)
    email = Column(String(160), nullable=False, index=True)
    phone = Column(String(80), nullable=True)
    organization = Column(String(180), nullable=True)
    city = Column(String(120), nullable=True)
    work_domain = Column(String(160), nullable=True)
    service_required = Column(String(220), nullable=True)
    requirement_notes = Column(Text, nullable=True)
    updated_notes = Column(Text, nullable=True)
    project_status = Column(String(100), default="New")
    created_at = Column(DateTime, default=datetime.utcnow)

    enquiries = relationship("Enquiry", back_populates="customer")
    files = relationship("ProjectFile", back_populates="customer")
    invoices = relationship("Invoice", back_populates="customer")
    requirement_notes_rows = relationship("RequirementNote", back_populates="customer")
    work_notes = relationship("WorkNote", back_populates="customer")

class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    full_name = Column(String(160), nullable=False)
    email = Column(String(160), nullable=False)
    phone = Column(String(80), nullable=True)
    organization = Column(String(180), nullable=True)
    city = Column(String(120), nullable=True)
    industry = Column(String(160), nullable=True)
    service_required = Column(String(220), nullable=True)
    project_stage = Column(String(160), nullable=True)
    timeline = Column(String(100), nullable=True)
    budget_range = Column(String(100), nullable=True)
    preferred_contact_mode = Column(String(80), nullable=True)
    need_payment_link = Column(String(40), nullable=True)
    project_description = Column(Text, nullable=False)
    status = Column(String(80), default="New")
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="enquiries")

class ProjectFile(Base):
    __tablename__ = "project_files"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    category = Column(String(120), nullable=False)
    original_filename = Column(String(260), nullable=False)
    stored_filename = Column(String(300), nullable=False)
    file_size = Column(Integer, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="files")

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    invoice_number = Column(String(80), nullable=False, unique=True)
    title = Column(String(220), nullable=False)
    total_amount = Column(Float, default=0)
    amount_paid = Column(Float, default=0)
    pending_amount = Column(Float, default=0)
    status = Column(String(80), default="Pending")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="invoices")
    payments = relationship("Payment", back_populates="invoice")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=True)
    customer_email = Column(String(160), nullable=True)
    amount = Column(Float, default=0)
    payment_mode = Column(String(80), nullable=True)
    reference = Column(String(160), nullable=True)
    status = Column(String(80), default="Submitted")
    notes = Column(Text, nullable=True)
    screenshot_filename = Column(String(300), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    invoice = relationship("Invoice", back_populates="payments")

class RequirementNote(Base):
    __tablename__ = "requirement_notes"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    title = Column(String(220), nullable=False)
    note = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="requirement_notes_rows")

class WorkNote(Base):
    __tablename__ = "work_notes"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    title = Column(String(220), nullable=False)
    note = Column(Text, nullable=False)
    status = Column(String(100), default="In Progress")
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="work_notes")
