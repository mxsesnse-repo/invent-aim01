"""
Invoice Process Tracking routes — track which process steps invoices have completed.
"""
from typing import Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from db.database import get_db
from db.models import (
    Invoice, InvoiceProcessTracking, WorkflowProcess, Workflow,
    ProductCatalog, Category, User,
)
from api.dependencies import get_current_active_user

router = APIRouter(prefix="/api/tracking", tags=["Process Tracking"])


# ─── Pydantic Schemas ─────────────────────────────────────────────────────────

class ToggleProcessRequest(BaseModel):
    completed: bool
    notes: Optional[str] = None


# ─── Routes ───────────────────────────────────────────────────────────────────

@router.get("/invoice/{invoice_id}")
def get_invoice_tracking(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Get full tracking status for an invoice.
    Returns the workflow, its processes, and completion status for each.
    """
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    category_name = invoice.po.category if invoice.po else None
    if not category_name:
        return {
            "invoice_id": invoice_id,
            "category": None,
            "processes": [],
            "progress": 0,
        }

    category = db.query(Category).filter(Category.name == category_name).first()
    if not category:
        return {
            "invoice_id": invoice_id,
            "category": category_name,
            "processes": [],
            "progress": 0,
        }

    workflows = db.query(Workflow).filter(Workflow.category_id == category.id).order_by(Workflow.order_index).all()
    
    process_list = []
    completed_count = 0

    tracking_records = db.query(InvoiceProcessTracking).filter(
        InvoiceProcessTracking.invoice_id == invoice_id,
    ).all()
    tracking_map = {t.process_id: t for t in tracking_records}

    for wf in workflows:
        processes = db.query(WorkflowProcess).filter(
            WorkflowProcess.workflow_id == wf.id
        ).order_by(WorkflowProcess.order_index).all()
        
        for proc in processes:
            tracking = tracking_map.get(proc.id)
            is_completed = tracking.completed if tracking else False
            if is_completed:
                completed_count += 1
            process_list.append({
                "process_id": proc.id,
                "workflow_name": wf.name,
                "name": proc.name,
                "description": proc.description,
                "order_index": proc.order_index,
                "completed": is_completed,
                "completed_at": tracking.completed_at.isoformat() if tracking and tracking.completed_at else None,
                "completed_by": tracking.completed_by.username if tracking and tracking.completed_by else None,
                "notes": tracking.notes if tracking else None,
            })

    total = len(process_list)
    progress = round((completed_count / total * 100), 1) if total > 0 else 0

    return {
        "invoice_id": invoice_id,
        "category": category_name,
        "invoice_category": invoice.category,
        "processes": process_list,
        "progress": progress,
        "completed_count": completed_count,
        "total_processes": total,
    }


@router.put("/invoice/{invoice_id}/process/{process_id}")
def toggle_process(
    invoice_id: int,
    process_id: int,
    data: ToggleProcessRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Mark a process step as completed or uncompleted for an invoice."""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    process = db.query(WorkflowProcess).filter(WorkflowProcess.id == process_id).first()
    if not process:
        raise HTTPException(status_code=404, detail="Process not found")

    # Find or create tracking record
    tracking = db.query(InvoiceProcessTracking).filter(
        InvoiceProcessTracking.invoice_id == invoice_id,
        InvoiceProcessTracking.process_id == process_id,
    ).first()

    if tracking:
        tracking.completed = data.completed
        tracking.completed_at = datetime.utcnow() if data.completed else None
        tracking.completed_by_id = current_user.id if data.completed else None
        if data.notes is not None:
            tracking.notes = data.notes
    else:
        tracking = InvoiceProcessTracking(
            invoice_id=invoice_id,
            process_id=process_id,
            completed=data.completed,
            completed_at=datetime.utcnow() if data.completed else None,
            completed_by_id=current_user.id if data.completed else None,
            notes=data.notes,
        )
        db.add(tracking)

    db.commit()
    db.refresh(tracking)
    return tracking.to_dict()


@router.get("/dashboard")
def tracking_dashboard(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Dashboard data: all invoices with their workflow progress, costs, and current stage.
    """
    # Get all categories
    categories = db.query(Category).order_by(Category.name).all()

    # Get all invoices, including those without a category
    q = db.query(Invoice)
    if category:
        if category == "Uncategorized":
            q = q.filter((Invoice.category.is_(None)) | (Invoice.category == ""))
        else:
            q = q.filter(Invoice.category == category)
    invoices = q.order_by(Invoice.id.desc()).all()

    # Build tracking info per invoice
    items = []
    total_cost = 0
    category_stats = {}

    for inv in invoices:
        total_cost += inv.grand_total or 0

        # Count by category (from matched PO Item Category)
        track_category = inv.po.category if inv.po else None
        cat_name = track_category or "Uncategorized"
        if cat_name not in category_stats:
            category_stats[cat_name] = {"count": 0, "total": 0, "quantity": 0}
        
        total_quantity = sum(li.quantity or 0 for li in inv.line_items) if inv.line_items else 0
        
        category_stats[cat_name]["count"] += 1
        category_stats[cat_name]["total"] += inv.grand_total or 0
        category_stats[cat_name]["quantity"] += total_quantity

        category_obj = db.query(Category).filter(Category.name == track_category).first() if track_category else None

        process_progress = 0
        current_stage = None
        completed_count = 0
        total_processes = 0

        if category_obj:
            workflows = db.query(Workflow).filter(Workflow.category_id == category_obj.id).order_by(Workflow.order_index).all()
            processes = []
            for wf in workflows:
                wf_procs = db.query(WorkflowProcess).filter(WorkflowProcess.workflow_id == wf.id).order_by(WorkflowProcess.order_index).all()
                processes.extend(wf_procs)
            
            total_processes = len(processes)

            tracking_records = db.query(InvoiceProcessTracking).filter(
                InvoiceProcessTracking.invoice_id == inv.id,
            ).all()
            tracking_map = {t.process_id: t for t in tracking_records}

            for proc in processes:
                t = tracking_map.get(proc.id)
                if t and t.completed:
                    completed_count += 1
                elif current_stage is None:
                    current_stage = proc.name

            if total_processes > 0:
                process_progress = round((completed_count / total_processes * 100), 1)

            if completed_count == total_processes and total_processes > 0:
                current_stage = "COMPLETED"

        # Get product description from line items
        description = "; ".join(li.name for li in inv.line_items if li.name)[:100] if inv.line_items else None

        items.append({
            "invoice_id": inv.id,
            "invoice_number": inv.invoice_number,
            "invoice_date": inv.invoice_date,
            "invoice_category": inv.category,
            "category": track_category,
            "description": description,
            "quantity": total_quantity,
            "grand_total": inv.grand_total,
            "status": inv.status,
            "current_stage": current_stage,
            "progress": process_progress,
            "completed_count": completed_count,
            "total_processes": total_processes,
        })

    # Summary stats
    summary = {
        "total_invoices": len(items),
        "total_cost": round(total_cost, 2),
        "category_breakdown": [
            {"name": k, "count": v["count"], "total": round(v["total"], 2), "quantity": round(v["quantity"], 2)}
            for k, v in category_stats.items()
        ],
        "categories": [c.to_dict(include_workflows=False) for c in categories],
    }

    return {
        "summary": summary,
        "items": items,
    }
