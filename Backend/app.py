
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import uvicorn

from database.database import Base, engine
from routes import answers, employees, chatgpt_questions, documents
from dotenv import load_dotenv

load_dotenv()

# -------------------- Initialize DB --------------------
Base.metadata.create_all(bind=engine)

# -------------------- Create App --------------------
app = FastAPI(title="Gautam Solar AI Evaluation", version="1.0")

# -------------------- Ensure Uploads Folder --------------------
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# -------------------- Serve Uploads --------------------
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# -------------------- CORS Middleware --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace "*" with allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- Include Routers --------------------
app.include_router(employees.router)           # /employees/ endpoints
app.include_router(answers.router)             # /evaluations/ endpoints
app.include_router(chatgpt_questions.router)  # /chatgpt_questions/ endpoints
app.include_router(documents.router)           # /documents/ endpoints

# -------------------- Root Endpoint --------------------
@app.get("/")
def root():
    return {"message": "Gautam Solar AI Evaluation API is running!"}

# # -------------------- Run Server --------------------

if __name__ == "__main__":
    # 👇 Fix port to 8000 permanently
    uvicorn.run("app:app", host="0.0.0.0", port=6501, reload=True)