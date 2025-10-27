from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from database.database import get_db
from models.models import UploadedDocument, Employee
import google.generativeai as genai
from config import GEMINI_API_KEY
import os
import PyPDF2
from docx import Document

router = APIRouter(prefix="/chatgpt_questions", tags=["Gemini Questions"])

# ✅ Configure Gemini client
genai.configure(api_key=GEMINI_API_KEY)


@router.get("/")
async def get_gemini_questions(
    role: str = Query(..., description="Role type (employee or auditor)"),
    punch_no: str = Query(..., description="Employee Punch Number"),
    db: Session = Depends(get_db)
):
    """
    Generate 5 bilingual (English + Hindi) audit questions for an employee
    based on their department and work location (machine/operator type).
    """

    # ✅ 1. Fetch employee details using punch_no
    employee = db.query(Employee).filter(Employee.punch_no == punch_no).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    department = employee.department or "General"
    work_location = employee.area or "General"

    # ✅ 2. Fetch relevant uploaded documents
    docs = db.query(UploadedDocument).filter(
        UploadedDocument.department == department
    ).all()

    doc_texts = ""
    for doc in docs:
        if os.path.exists(doc.file_path):
            try:
                # --- PDF File ---
                if doc.file_path.lower().endswith(".pdf"):
                    with open(doc.file_path, "rb") as f:
                        reader = PyPDF2.PdfReader(f)
                        for page in reader.pages:
                            text = page.extract_text()
                            if text:
                                doc_texts += text + "\n"

                # --- Word File (.docx) ---
                elif doc.file_path.lower().endswith(".docx"):
                    word_doc = Document(doc.file_path)
                    for para in word_doc.paragraphs:
                        doc_texts += para.text + "\n"

                # --- Plain Text File (.txt) ---
                elif doc.file_path.lower().endswith(".txt"):
                    with open(doc.file_path, "r", encoding="utf-8") as f:
                        doc_texts += f.read() + "\n"

                else:
                    print(f"[WARN] Unsupported file format: {doc.file_path}")

            except Exception as e:
                print(f"[WARN] Could not read {doc.file_path}: {e}")
                continue

    print("✅ Extracted document text length:", len(doc_texts))

    # ✅ 3. Handle case when no specific docs found
    if not doc_texts.strip():
        doc_texts = (
            f"No specific document found for {department} - {work_location}. "
            f"Generate general questions about {department} department and "
            f"{work_location} operations in solar panel manufacturing."
        )

    # ✅ 4. Build Gemini prompt
    prompt = f"""
    You are an AI Technical Auditor for a Solar Panel Manufacturing Company.

    Generate 5 bilingual (English + Hindi) audit questions for an employee working as 
    a '{work_location}' in the '{department}' department.

    Reference document content below to create technical, safety, and process-based questions:
    {doc_texts}

    If the document content is insufficient, include 2–3 general but relevant questions related to 
    the work location or machine type, such as maintenance, safety, inspection, and performance checks.

    Format strictly as:
    1. English Question (Hindi Question)
    2. English Question (Hindi Question)
    3. ...
    """

    try:
        # ✅ Use Gemini 2.0 Flash model
        model = genai.GenerativeModel("models/gemini-2.0-flash")
        response = model.generate_content(prompt)

        questions_text = getattr(response, "text", "") or ""
        questions = [
            q.strip()
            for q in questions_text.split("\n")
            if q.strip() and not q.strip().isdigit()
        ]

        if not questions:
            raise HTTPException(
                status_code=500,
                detail="Gemini API returned no questions. Please verify API key or model."
            )

        return {
            "employee_name": employee.name,
            "department": department,
            "work_location": work_location,
            "questions": questions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {e}")
