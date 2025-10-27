# # # Backend/services/evaluator.py

# import os
# import google.generativeai as genai

# # ✅ Configure Gemini API securely
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# if GEMINI_API_KEY:
#     genai.configure(api_key=GEMINI_API_KEY)
# else:
#     print("⚠️ Warning: GEMINI_API_KEY not found in environment variables. Evaluation will use default output.")

# def evaluate_answer(answer_text: str, question: str):
#     """
#     Evaluates an employee's answer using Google Gemini AI.
#     Returns marks (out of 10) and improvement suggestion.
#     Works even if API key is missing (safe fallback).
#     """

#     prompt = f"""
#     You are an expert evaluator for employee assessments in a solar panel manufacturing company.

#     Evaluate the following employee's answer.

#     Question: {question}
#     Employee's Answer: {answer_text}

#     Give response in this format only:
#     Marks: <number out of 10>
#     Suggestion: <short suggestion for improvement>
#     """

#     # If API key configured — use Gemini model
#     if GEMINI_API_KEY:
#         try:
#             model = genai.GenerativeModel("models/gemini-2.0-flash")
#             response = model.generate_content(prompt)

#             # Extract text safely
#             result = response.text.strip() if hasattr(response, "text") else str(response)

#             # Parse marks and suggestion
#             marks = 5
#             suggestion = "No suggestion"
#             for line in result.splitlines():
#                 line = line.strip()
#                 if line.lower().startswith("marks:"):
#                     try:
#                         marks = int(line.split(":")[1].strip())
#                     except Exception:
#                         marks = 5
#                 elif line.lower().startswith("suggestion:"):
#                     suggestion = line.split(":", 1)[1].strip()

#             return marks, suggestion

#         except Exception as e:
#             # Gemini call failed
#             return 5, f"Gemini evaluation error: {str(e)}"

#     # Fallback if API key missing
#     return 5, "Gemini API key not found — default evaluation used."



#tomorrow code working

# def evaluate_answer(transcript, question):
#     # Placeholder logic
#     marks = len(transcript.split()) % 10  # Example: marks based on word count
#     suggestion = "Good answer" if marks > 5 else "Needs improvement"
#     return marks, suggestion


###today code for testing
# import os
# import re
# import json
# import random
# import google.generativeai as genai
# from config import GEMINI_API_KEY

# # ✅ Configure Gemini API
# # GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# # genai.configure(api_key=GEMINI_API_KEY)

# if GEMINI_API_KEY:
#     genai.configure(api_key=GEMINI_API_KEY)
#     print("[INFO] Gemini API key loaded successfully.")
# else:
#     print("⚠️ GEMINI_API_KEY not found. Using offline evaluation logic.")


# def evaluate_answer(answer_text: str, question: str):
#     """
#     Evaluates employee's Hindi or English answer.
#     Returns (marks, suggestion).
#     """
#     prompt = f"""
#     आप एक अनुभवी एचआर मूल्यांकनकर्ता हैं जो सोलर पैनल मैन्युफैक्चरिंग कंपनी में काम करते हैं।
#     नीचे दिए गए उत्तर का मूल्यांकन करें।

#     प्रश्न: {question}
#     कर्मचारी का उत्तर: {answer_text}

#     निम्न प्रारूप में हिंदी में उत्तर दें:
#     {{
#       "marks": <0 से 10 तक अंक>,
#       "suggestion": "<सुधार के लिए एक छोटी सलाह>"
#     }}
#     """

#     # --- Online Gemini Evaluation ---
#     if GEMINI_API_KEY:
#         try:
#             model = genai.GenerativeModel("models/gemini-2.0-flash")
#             response = model.generate_content(prompt)
#             text = response.text.strip() if hasattr(response, "text") else str(response)

#             try:
#                 data = json.loads(text)
#                 marks = int(data.get("marks", random.randint(4, 9)))
#                 suggestion = data.get("suggestion", "उत्तर अच्छा है, और सुधार करें।")
#             except Exception:
#                 marks_match = re.search(r"marks\s*[:=]\s*(\d+)", text, re.I)
#                 sugg_match = re.search(r"suggestion\s*[:=]\s*(.*)", text, re.I)
#                 marks = int(marks_match.group(1)) if marks_match else random.randint(4, 9)
#                 suggestion = sugg_match.group(1).strip() if sugg_match else "स्पष्टता और उदाहरण जोड़ें।"

#             return marks, suggestion

#         except Exception as e:
#             print("[WARN] Gemini evaluation failed:", e)

#     # --- Offline fallback logic ---
#     words = answer_text.strip().split()
#     length = len(words)

#     if length == 0:
#         return 0, "कोई उत्तर नहीं मिला।"
#     elif length < 5:
#         return random.randint(2, 4), "उत्तर बहुत छोटा है, विस्तार से बताएं।"
#     elif "सुरक्षा" in answer_text or "सेफ्टी" in answer_text or "मशीन" in answer_text:
#         return random.randint(7, 10), "उत्तर सही दिशा में है।"
#     else:
#         return random.randint(4, 8), "उत्तर ठीक है, और विवरण जोड़ें।"


##### TESTING

# import os
# import re
# import json
# import random
# import google.generativeai as genai
# from config import GEMINI_API_KEY

# # ✅ Configure Gemini API
# if GEMINI_API_KEY:
#     genai.configure(api_key=GEMINI_API_KEY)
#     print("[INFO] Gemini API key loaded successfully.")
# else:
#     print("⚠️ GEMINI_API_KEY not found. Using offline evaluation logic.")


# def evaluate_answer(answer_text: str, question: str):
#     """
#     Evaluates employee's Hindi or English answer using Gemini API if available.
#     Returns (marks, suggestion). Falls back to offline logic only if API fails.
#     """
#     prompt = f"""
# आप एक अनुभवी एचआर मूल्यांकनकर्ता हैं जो सोलर पैनल मैन्युफैक्चरिंग कंपनी में काम करते हैं।
# नीचे दिए गए उत्तर का मूल्यांकन करें।

# प्रश्न: {question}
# कर्मचारी का उत्तर: {answer_text}

# ⚠️ जवाब को केवल JSON में दें, कोई अतिरिक्त टेक्स्ट नहीं:
# {{
#   "marks": <0 से 10 तक अंक>,
#   "suggestion": "<सुधार के लिए एक छोटी सलाह>"
# }}
# """

#     # --- Online Gemini Evaluation ---
#     if GEMINI_API_KEY:
#         try:
#             model = genai.GenerativeModel("models/gemini-2.0-flash")
#             response = model.generate_content(prompt)
#             text = response.text.strip() if hasattr(response, "text") else str(response)

#             # DEBUG: see raw output from Gemini
#             print("[DEBUG] Gemini raw output:", text)

#             # Try parsing JSON strictly
#             data = json.loads(text)
#             marks = int(data.get("marks", 0))
#             suggestion = data.get("suggestion", "").strip()

#             # Validate values
#             if not (0 <= marks <= 10):
#                 print("[WARN] Marks out of range, using fallback random marks.")
#                 marks = random.randint(4, 9)
#             if not suggestion:
#                 suggestion = "उत्तर अच्छा है, और सुधार करें।"

#             return marks, suggestion

#         except Exception as e:
#             print("[WARN] Gemini evaluation failed, using fallback:", e)

#     # --- Offline fallback logic ---
#     words = answer_text.strip().split()
#     length = len(words)

#     if length == 0:
#         return 0, "कोई उत्तर नहीं मिला।"
#     elif length < 5:
#         return random.randint(2, 4), "उत्तर बहुत छोटा है, विस्तार से बताएं।"
#     elif any(word in answer_text for word in ["सुरक्षा", "सेफ्टी", "मशीन"]):
#         return random.randint(7, 10), "उत्तर सही दिशा में है।"
#     else:
#         return random.randint(4, 8), "उत्तर ठीक है, और विवरण जोड़ें।"



####new

import os
import json
import random
import google.generativeai as genai
from config import GEMINI_API_KEY

# --- Configure Gemini API ---
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    print("[INFO] Gemini API key loaded successfully.")
else:
    print("⚠️ GEMINI_API_KEY not found. Using offline evaluation logic.")


def evaluate_answer(answer_text: str, question: str):
    """
    Evaluate an employee's Hindi/English answer using Gemini API.
    Returns:
        marks (0-10) and suggestion from Gemini.
    Offline fallback triggers only if API fails or returns invalid JSON.
    """
    prompt = f"""
आप एक अनुभवी एचआर मूल्यांकनकर्ता हैं जो सोलर पैनल मैन्युफैक्चरिंग कंपनी में काम करते हैं।
नीचे दिए गए उत्तर का मूल्यांकन करें।

प्रश्न: {question}
कर्मचारी का उत्तर: {answer_text}

⚠️ जवाब को केवल JSON में दें, कोई अतिरिक्त टेक्स्ट नहीं:
{{
  "marks": "<0 से 10 तक अंक>",
  "suggestion": "<सुधार के लिए एक छोटी सलाह>"
}}
"""

    # --- Online Gemini Evaluation ---
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel("models/gemini-2.0-flash")
            response = model.generate_content(prompt)
            text = response.text.strip() if hasattr(response, "text") else str(response)

            # DEBUG: raw Gemini output
            print("[DEBUG] Gemini raw output:", text)

            # --- Clean triple backticks if present
            clean_text = text
            if clean_text.startswith("```"):
                clean_text = "\n".join(clean_text.split("\n")[1:])
            if clean_text.endswith("```"):
                clean_text = "\n".join(clean_text.split("\n")[:-1])
            clean_text = clean_text.strip()

            # --- Parse JSON
            data = json.loads(clean_text)
            marks = int(data.get("marks", 0))
            suggestion = data.get("suggestion", "").strip()

            # Validate values
            if not (0 <= marks <= 10):
                print("[WARN] Marks out of range, using fallback random marks.")
                marks = random.randint(4, 9)
            if not suggestion:
                suggestion = "उत्तर अच्छा है, और सुधार करें।"

            return marks, suggestion

        except Exception as e:
            print("[WARN] Gemini evaluation failed, using offline fallback:", e)

    # --- Offline fallback logic ---
    words = answer_text.strip().split()
    length = len(words)

    if length == 0:
        return 0, "कोई उत्तर नहीं मिला।"
    elif length < 5:
        return random.randint(2, 4), "उत्तर बहुत छोटा है, विस्तार से बताएं।"
    elif any(word in answer_text for word in ["सुरक्षा", "सेफ्टी", "मशीन"]):
        return random.randint(7, 10), "उत्तर सही दिशा में है।"
    else:
        return random.randint(4, 8), "उत्तर ठीक है, और विवरण जोड़ें।"
