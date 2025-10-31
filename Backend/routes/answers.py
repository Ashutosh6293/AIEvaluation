
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from models.models import Evaluation, Employee
from services.storage import save_video
from services.transcriber import extract_audio, transcribe_audio
from services.evaluator import evaluate_answer
import os

router = APIRouter()

@router.post("/api/upload_answer/")
async def upload_answer(
    employee_id: str = Form(...),
    question: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        print(f"[DEBUG] Received upload request: employee_id={employee_id}, question={question}, filename={file.filename}")

        # ✅ Try to find employee by both punch_no and id
        employee = None
        try:
            # Try punch_no first (string)
            employee = db.query(Employee).filter(Employee.punch_no == str(employee_id)).first()
            # If not found, try numeric id
            if not employee:
                employee = db.query(Employee).filter(Employee.id == int(employee_id)).first()
        except Exception as lookup_err:
            print(f"[DEBUG] Employee lookup error: {lookup_err}")

        # ✅ Ensure we found an employee
        if not employee:
            raise HTTPException(status_code=404, detail=f"Employee not found for ID or punch_no: {employee_id}")

        print(f"[DEBUG] ✅ Employee found -> id={employee.id}, punch_no={employee.punch_no}, name={employee.name}, department={employee.department}")

        # ✅ Save video
        video_path = save_video(file.file, file.filename)
        print(f"[DEBUG] Video saved to: {video_path}")
        print(f"[DEBUG] Video exists? {os.path.exists(video_path)}")

        # ✅ Convert to audio
        audio_path = video_path.replace(".webm", ".mp3")
        extract_audio(video_path, audio_path)
        print(f"[DEBUG] Audio extracted to: {audio_path}")
        print(f"[DEBUG] Audio exists? {os.path.exists(audio_path)}")

        # ✅ Transcribe audio
        transcript = transcribe_audio(audio_path)
        print(f"[DEBUG] Transcript: {transcript}")

        # ✅ Evaluate answer
        marks, suggestion = evaluate_answer(transcript, question)
        print(f"[DEBUG] Evaluation result: marks={marks}, suggestion={suggestion}")
        print(f"[DEBUG] Saving evaluation with department={employee.department}")

        # ✅ Save evaluation in DB
        new_eval = Evaluation(
            employee_id=employee.punch_no,   # foreign key = punch_no
            department=employee.department or "Unknown",  # fetched from Employee
            question=question,
            answer=transcript,
            marks=marks,
            suggestion=suggestion,
            video_path=video_path
        )

        db.add(new_eval)
        db.commit()
        db.refresh(new_eval)
        print(f"[DEBUG] ✅ Evaluation saved in DB with ID: {new_eval.id}")

        return {
            "marks": marks,
            "suggestion": suggestion,
            "transcript": transcript
        }

    except Exception as e:
        print(f"[ERROR] Exception in /upload_answer/: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/evaluations/")
def list_evaluations(db: Session = Depends(get_db)):
    rows = (
        db.query(
            Evaluation.id,
            Employee.punch_no,
            Employee.name.label("employee_name"),
            Employee.area,
            Employee.department,
            Evaluation.question,
            Evaluation.marks,
            Evaluation.suggestion,
            Evaluation.video_path,
        )
        .join(Employee, Evaluation.employee_id == Employee.id)
        .all()
    )

    out = []
    for r in rows:
        out.append({
            "id": r.id,
            "punch_no": r.punch_no,
            "employee_name": r.employee_name,
            "area": r.area,
            "department": r.department,
            "question": r.question,
            "marks": r.marks,
            "suggestion": r.suggestion,
            "video_url": r.video_path,
        })

    return out