from pydantic import BaseModel

class EmployeeSchema(BaseModel):
    punch_no: str
    name: str
    area: str

class EvaluationSchema(BaseModel):
    employee_id: int
    question: str
    answer: str
    marks: int
    suggestion: str
    video_path: str

    class Config:
        orm_mode = True
