from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.database import get_db
from models.models import Employee, Evaluation
from pydantic import BaseModel

router = APIRouter()

# ---------------- Employee Creation ----------------
class EmployeeCreate(BaseModel):
    punch_no: str
    name: str
    department:str
    area: str

@router.post("/employees/", status_code=status.HTTP_201_CREATED)
def create_employee(data: EmployeeCreate, db: Session = Depends(get_db)):
    existing = db.query(Employee).filter(Employee.punch_no == data.punch_no).first()
    if existing:
        return {"message": "Employee already exists", "id": existing.id}

    emp = Employee(punch_no=data.punch_no, name=data.name,department=data.department, area=data.area)
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return {
        "id": emp.id,
        "punch_no": emp.punch_no,
        "name": emp.name,
        "department":emp.department,
        "area": emp.area,
    }

# ---------------- Fetch All Employees ----------------
@router.get("/employees/")
def get_all_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    return [
        {"id": e.id, "punch_no": e.punch_no, "name": e.name,"department": e.department, "area": e.area}
        for e in employees
    ]

# ---------------- Top Performers (Overall / Department-wise) ----------------
@router.get("/employees/top-performers/")
def get_top_performers(department: str = None, db: Session = Depends(get_db)):
    # Join Employees with Evaluations
    query = (
        db.query(
            Employee.id,
            Employee.name,
            Employee.area,
            func.coalesce(func.avg(Evaluation.marks), 0).label("avg_score"),
        )
        .outerjoin(Evaluation, Evaluation.employee_id == Employee.punch_no)
        .group_by(Employee.id)
        .order_by(func.avg(Evaluation.marks).desc())
    )

    if department:
        query = query.filter(Employee.area == department)

    top_employees = query.limit(5).all()

    # Convert SQLAlchemy rows into JSON serializable dicts
    result = [
        {
            "id": emp.id,
            "name": emp.name,
            "area": emp.area,
            "avg_score": float(emp.avg_score) if emp.avg_score else 0.0,
        }
        for emp in top_employees
    ]

    return {"top_performers": result}
