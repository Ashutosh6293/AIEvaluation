from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database.database import Base
from datetime import datetime

class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    punch_no = Column(String(50), unique=True)
    name = Column(String(100))
    department = Column(String(100), nullable=False)
    area = Column(String(100))

    evaluations = relationship("Evaluation", back_populates="employee")

class Evaluation(Base):
    __tablename__ = "evaluations"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.punch_no"), nullable=False)
    department = Column(String(100), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    marks = Column(Integer, nullable=False)
    department=Column(Text,nullable=False)
    suggestion = Column(Text, nullable=True)
    video_path = Column(String(255), nullable=True)

    employee = relationship("Employee", back_populates="evaluations")

class UploadedDocument(Base):
    __tablename__ = "uploaded_documents"
    id = Column(Integer, primary_key=True, index=True)
    department = Column(String(100), nullable=False)
    # work_location = Column(String(100), nullable=True)
    file_path = Column(String(255), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
