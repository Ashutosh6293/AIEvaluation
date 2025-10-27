# Backend/database/database.py

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import urllib.parse

# ✅ Read database credentials securely from environment variables
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "Ashu@620930")  # default for local dev only
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DB = os.getenv("MYSQL_DB", "employee_assessment")

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
