# import os, shutil
# from config import VIDEO_DIR

# def save_video(file, filename: str) -> str:
#     path = os.path.join(VIDEO_DIR, filename)
#     with open(path, "wb") as buffer:
#         shutil.copyfileobj(file, buffer)
#     return path



###new##
import os

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_video(file, filename):
    try:
        path = os.path.join(UPLOAD_DIR, filename)
        with open(path, "wb") as f:
            f.write(file.read())
        return path
    except Exception as e:
        print(f"[ERROR] save_video failed: {e}")
        raise
