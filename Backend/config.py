# import os
# from dotenv import load_dotenv


# load_dotenv()
# # OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# DB_USER = os.getenv("DB_USER", "root")
# DB_PASS = os.getenv("DB_PASS", "Ashu@620930")
# DB_HOST = os.getenv("DB_HOST", "localhost")
# DB_NAME = os.getenv("DB_NAME", "employee_assessment")

# VIDEO_DIR = os.path.join(os.getcwd(),"app", "videos")
# os.makedirs(VIDEO_DIR, exist_ok=True)


import os
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

# API Keys
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Database Configuration
DB_USER = os.getenv("DB_USER", "rohit")
DB_PASS = os.getenv("DB_PASS", "rohit0101")
DB_HOST = os.getenv("DB_HOST", "93.127.194.235")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "employee_assessment")

# Construct SQLAlchemy URL
SQLALCHEMY_DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# Video directory path
VIDEO_DIR = os.path.join(os.getcwd(), "app", "videos")
os.makedirs(VIDEO_DIR, exist_ok=True)