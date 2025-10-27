import os
from dotenv import load_dotenv


load_dotenv()
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

DB_USER = os.getenv("DB_USER", "root")
DB_PASS = os.getenv("DB_PASS", "Ashu@620930")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "employee_assessment")

VIDEO_DIR = os.path.join(os.getcwd(),"app", "videos")
os.makedirs(VIDEO_DIR, exist_ok=True)
