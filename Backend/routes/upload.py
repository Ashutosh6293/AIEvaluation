from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import os

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload/")
async def upload_video(file: UploadFile = File(...), employee_id: str = Form(None)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        return {"message": "Video uploaded successfully", "path": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
