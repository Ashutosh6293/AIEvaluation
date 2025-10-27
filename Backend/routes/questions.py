from fastapi import APIRouter

router = APIRouter()

@router.get("/questions/")
def get_questions():
    return [
        "Introduce yourself and explain your role in the company.",
        "What challenges have you faced in your area?",
        "How do you ensure quality in your work?"
    ]
