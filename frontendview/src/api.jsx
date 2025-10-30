// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://127.0.0.1:8000",
// });

// export default API;

import axios from "axios";

const API = axios.create({
  // baseURL: "http://93.127.194.235:6501", // FastAPI backend URL
  baseURL: "http://127.0.0.1:6501", 
});

// -------------------- Employee Evaluations --------------------
export const getEvaluations = () => API.get("/evaluations/");

// -------------------- Document Upload --------------------
export const uploadDocument = (formData) =>
  API.post("/upload_document", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// -------------------- Top Performers --------------------
export const getTopPerformers = () => API.get("/top_performers");
export const getDeptTopPerformers = (department) =>
  API.get(`/documents/top_performers/${department}`);

// -------------------- Gemini AI Questions --------------------
export const getGeminiQuestions = (role = "employee", area = "general") =>
  API.get(`/chatgpt_questions/?role=${role}&area=${area}`);

export default API;
