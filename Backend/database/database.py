# # Backend/database/database.py

# import os
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base
# from dotenv import load_dotenv
# import urllib.parse

# # ✅ Load .env file
# dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
# load_dotenv(dotenv_path)

# # ✅ Read database credentials from environment
# MYSQL_USER = os.getenv("MYSQL_USER", "rohit")
# MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "rohit0101")
# MYSQL_HOST = os.getenv("MYSQL_HOST", "93.127.194.235")
# MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
# MYSQL_DB = os.getenv("MYSQL_DB", "employee_assessment")

# # ✅ Encode password (handles @, $, etc.)
# MYSQL_PASSWORD = urllib.parse.quote_plus(MYSQL_PASSWORD)

# # ✅ Build SQLAlchemy database URL
# DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"

# # ✅ Create engine
# engine = create_engine(DATABASE_URL, echo=True, pool_pre_ping=True)

# # ✅ Create session factory
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # ✅ Base class for ORM models
# Base = declarative_base()

# # ✅ DB session dependency
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()




# Backend/database/database.py

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import urllib.parse
from dotenv import load_dotenv

# ✅ Load environment variables from .env file
load_dotenv()


# ✅ Read database credentials securely from environment variables
MYSQL_USER = os.getenv("DB_USER")
MYSQL_PASSWORD = os.getenv("DB_PASS")  # default for local dev only
MYSQL_HOST = os.getenv("DB_HOST")
MYSQL_PORT = os.getenv("DB_PORT")
MYSQL_DB = os.getenv("DB_NAME")
print(" MYSQL_PASSWORD",MYSQL_PASSWORD)
# Encode password (handles special chars)
MYSQL_PASSWORD = urllib.parse.quote_plus(MYSQL_PASSWORD)

# ✅ Build SQLAlchemy database URL
DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"

# ✅ SQLAlchemy setup
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ✅ Helper function for getting DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
