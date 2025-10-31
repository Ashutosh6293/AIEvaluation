import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import VideoRecorder from "../components/VideoRecorder";
import axios from "axios";
import API from "../api";

// const API_URL = import.meta.env.VITE_API_URL || "http://93.127.194.235:6501";

export default function Assessment() {
  const [searchParams] = useSearchParams();
  const punchNo = searchParams.get("punch_no");
  const name = searchParams.get("name") || "Employee";
  const department = searchParams.get("department") || "N/A";
  const area = searchParams.get("area") || "N/A";

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(false)

  const [isRecordingStarted, setIsRecordingStarted] = useState(false);


  // console.log("questions",questions);

  const navigate = useNavigate()


  useEffect(() => {
    let fetched = false;
    async function fetchQuestions() {
       if (fetched) return;
        fetched = true;
      try {
        setLoading(true)
        console.log("📥 Fetching questions for Punch No:", punchNo);
        const res = await API.get(
          `/chatgpt_questions/?role=employee&punch_no=${punchNo}`
        );
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error("❌ Failed to fetch questions:", err);
        setQuestions([]);
      } finally {
        setLoading(false)
      }
    }

    if (punchNo) fetchQuestions();
    return () => {
    fetched = true;
  };
  }, [punchNo]);

  const handleVideoSubmit = (blob, backendResult) => {
    setResult(backendResult);
    setIsAnswered(true);

  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setResult(null);
      setIsAnswered(false);
    } else {
      alert("🎉 You have completed all questions!");
      // After completing all questions, redirect to Dashboard
      //   setTimeout(() => {
      //   window.location.href = "/";
      // }, 1500); 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-[100vw] flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-[100vw] bg-gradient-to-r from-blue-100 to-blue-300 flex justify-center px-4 py-4">
      <div
        className="bg-white shadow-xl rounded-3xl w-full max-w-3xl flex flex-col mx-auto px-6 py-2"
      // style={{ minHeight: "30vh" }}
      >
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Hello {name}!
          </h2>
          <p className="text-gray-600 mt-1">
            Department: {department} | Area: {area}
          </p>
          <p className="text-gray-500 text-sm">Employee ID: {punchNo}</p>
        </div>


        {!result && (
          <>
            <div className="mb-6">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                {questions.length > 0
                  ? questions[currentIndex]
                  : "Please wait a moment — Questions are loading..."}
              </h4>

              {questions.length > 0 && (
                <VideoRecorder
                  onSubmit={handleVideoSubmit}
                  employeeId={punchNo}
                  question={questions}
                  isLastQuestion={currentIndex === questions.length - 1}
                   onRecordingChange={setIsRecordingStarted} // ✅ callback
                />
              )}
            </div>

            <div className="flex justify-end mt-auto">
              <button
                onClick={handleNext}
                disabled={!isRecordingStarted}
                className={`py-2 px-6 rounded-xl font-semibold transition-all duration-300 ${isAnswered || !isRecordingStarted
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
              >
                {currentIndex === questions.length - 1
                  ? "Finish"
                  : "Next Question →"}
              </button>
            </div>
          </>
        )}

        {result && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-gray-800">
                <strong>Marks:</strong> {result.marks}
              </p>
              <p className="text-gray-800">
                <strong>Suggestion:</strong> {result.suggestion}
              </p>
            </div>

            <div className="flex justify-end mt-auto">
              <button
                onClick={() => navigate("/")}
                // disabled={!isAnswered}
                className={`py-2 px-6 rounded-xl font-semibold transition-all duration-300 bg-gray-300 text-gray-600 cursor-not-allowed
                }`}
              >
                Go To Login
              </button>
            </div>

          </>
        )}
      </div>
    </div>
  );
}
