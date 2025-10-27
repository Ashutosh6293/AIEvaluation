# routes/documents.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from database.database import get_db
from models.models import UploadedDocument, Employee, Evaluation
from fastapi.responses import JSONResponse
from sqlalchemy import func

import os
from datetime import datetime

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# -------------------- Upload Document --------------------
@router.post("/upload_document")
async def upload_document(
    file: UploadFile = File(...),
    department: str = Form(...),
    # location: str = Form(...),
    db: Session = Depends(get_db),
):
    try:
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        file_path = os.path.join(UPLOAD_DIR, f"{timestamp}_{file.filename}")

        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        doc = UploadedDocument(
            department=department,
            # work_location=location,
            file_path=file_path,
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)

        return {"message": "File uploaded successfully", "id": doc.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {e}")

# -------------------- Overall Top Performers --------------------
@router.get("/top_performers")
def overall_top_performers(db: Session = Depends(get_db)):
    """
    Returns overall top 10 employees based on average marks across all evaluations.
    """
    result = (
        db.query(
            Employee.punch_no,
            Employee.name,
            # Employee.area.label("department"),
            func.avg(Evaluation.marks).label("avg_marks")
        )
        .join(Evaluation, Evaluation.employee_id == Employee.id)
        .group_by(Employee.punch_no,Employee.name)
        .order_by(func.avg(Evaluation.marks).desc())
        .limit(10)
        .all()
    )
    return [dict(r._mapping) for r in result]

# -------------------- Department-wise Top Performers --------------------
@router.get("/top_performers/{department}")
def department_top_performers(department: str, db: Session = Depends(get_db)):
    """
    Returns top 5 employees for a given department based on average marks.
    """
    result = (
        db.query(
            Employee.id,
            Employee.name,
            Employee.punch_no,
            func.avg(Evaluation.marks).label("avg_marks")
        )
        .join(Evaluation, Evaluation.employee_id == Employee.id)
        .filter(Employee.department == department)
        .group_by(Employee.id)
        .order_by(func.avg(Evaluation.marks).desc())
        .limit(5)
        .all()
    )
    return [dict(r._mapping) for r in result]
