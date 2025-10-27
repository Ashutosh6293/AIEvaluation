
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Dashboard() {
  const [evaluations, setEvaluations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [topPerformers, setTopPerformers] = useState([]);
  const [deptTopPerformers, setDeptTopPerformers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();
  const [showFull, setShowFull] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 6;



  // console.log("deptTopPerformers",deptTopPerformers);
  // console.log("evaluations",evaluations);


  // ✅ Fetch Evaluations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/evaluations/");
        setEvaluations(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch evaluations:", err);
        setEvaluations([]);
      }
    };
    fetchData();
  }, []);

  // ✅ Filter by Employee ID
  const filteredEvaluations = evaluations.filter((e) =>
    e.punch_no?.toString().includes(searchTerm.trim())
  );

  // ✅ Upload Document
  const handleUpload = async () => {
    // if (!file || !department || !location)
    if (!file || !department) {
      alert("Please select file, department, and location");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("department", department);
    // formData.append("location", location); // match backend field
    try {
      const res = await API.post("/upload_document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(res.data.message || "File uploaded successfully!");
      setFile(null);
      setDepartment("");
      // setLocation("");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error uploading file");
    }
  };

  // ✅ Fetch Overall Top Performers
  const fetchTopPerformers = async () => {
    try {
      const res = await API.get("/top_performers");
      setTopPerformers(res.data);
    } catch (err) {
      console.error("Failed to fetch top performers:", err);
    }
  };

  // ✅ Fetch Department-wise Top Performers
  const fetchDeptTopPerformers = async () => {
    if (!department) {
      alert("Please select a department first");
      return;
    }
    try {
      const res = await API.get(`/top_performers/${department}`);
      setDeptTopPerformers(res.data);
    } catch (err) {
      console.error("Failed to fetch department performers:", err);
    }
  };

  // ✅ Fetch Gemini Questions (Employee-based)
  // const fetchGeminiQuestions = async () => {
  //   if (!selectedEmployee) {
  //     alert("Please select an employee first");
  //     return;
  //   }
  //   try {
  //     const res = await API.get(`/chatgpt_questions/?role=employee&area=${department}`);
  //     setQuestions(res.data.questions || []);
  //   } catch (err) {
  //     console.error("Failed to fetch Gemini questions:", err);
  //     alert("Error fetching questions");
  //   }
  // };

  const handleLogin = () => navigate("/");


  // Calculate total pages
const totalPages = Math.ceil(filteredEvaluations.length / itemsPerPage);

// Slice evaluations for current page
const currentEvaluations = filteredEvaluations.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

// Change page function
const handlePageChange = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages) {
    setCurrentPage(newPage);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">
          Gautam Solar Private Limited
          <br />
          Employee AI Evaluation Dashboard
        </h1>
        <p className="text-gray-500">
          Track performance, suggestions, and AI feedback in real-time
        </p>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="mt-3 w-34 rounded-full border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-700 hover:text-white transition-all"
        >
          Login
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex justify-end mb-6">
        <input
          type="text"
          placeholder="🔍 Search by Employee ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 rounded-full border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Document Upload Section */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          📄 Upload Department Documents
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <select
            onChange={(e) => setDepartment(e.target.value)}
            value={department}
            className="border p-2 rounded-lg"
          >
            <option value="">Select Department</option>
            <option value="Production">Production</option>
            <option value="Quality">Quality</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Store">Store</option>
            <option value="HR">HR</option>
            <option value="EHS">EHS</option>
            <option value="packeging">Packaging</option>
            <option value="dispatch">Dispatch</option>
            <option value="ppc">PPC</option>
          </select>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded-lg"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-dark px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Upload
          </button>
        </div>
      </div>

      {/* Top Performer Section */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          🏆 Top Performers
        </h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={fetchTopPerformers}
            className="bg-green-600 text-dark px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
          >
            Overall Top Employees
          </button>

          <select
            onChange={(e) => setDepartment(e.target.value)}
            value={department}
            className="border p-2 rounded-lg"
          >
            <option value="">Select Department</option>
            <option value="Production">Production</option>
            <option value="Quality">Quality</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Store">Store</option>
            <option value="HR">HR</option>
            <option value="EHS">EHS</option>
            <option value="packeging">Packaging</option>
            <option value="dispatch">Dispatch</option>
            <option value="ppc">PPC</option>
          </select>

          <button
            onClick={fetchDeptTopPerformers}
            className="bg-purple-600 text-dark px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
          >
            Department Top Employees
          </button>
        </div>

        {/* Top Performers Tables */}
        {topPerformers?.length > 0 && (
          <div className="overflow-x-auto mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              🥇 Overall Top Employees
            </h3>
            <table className="w-full border border-gray-200 rounded-lg text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Employee</th>
                  <th className="p-2 text-left">Punch No.</th>
                  <th className="p-2 text-left">Avg Marks</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers?.map((emp, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-2">{emp.name}</td>
                    <td className="p-2">{emp.punch_no}</td>
                    <td className="p-2 font-semibold text-blue-600">
                      {emp.avg_marks?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {deptTopPerformers?.length > 0 && (
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              🏅 Department-wise Top Employees ({department})
            </h3>
            <table className="w-full border border-gray-200 rounded-lg text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Employee</th>
                  <th className="p-2 text-left">Punch No.</th>
                  <th className="p-2 text-left">Avg Marks</th>
                </tr>
              </thead>
              <tbody>
                {deptTopPerformers.map((emp, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-2">{emp.name}</td>
                    <td className="p-2">{emp.punch_no}</td>

                    <td className="p-2 font-semibold text-green-600">
                      {emp.avg_marks?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    {filteredEvaluations.length === 0 ? (
  <div className="text-center text-gray-400 py-10">
    <h5 className="text-lg">No evaluations found 🚫</h5>
  </div>
) : (
  <>
    {/* Evaluation Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {currentEvaluations.map((item) => {
        const formattedQuestion = item.question
          ? item.question
              .replace(/,\s*(?=\d+\.\s)/g, "\n\n")
              .replace(/^Okay.*?:\s*/, "")
              .trim()
          : "No question available";

        const shortQuestion =
          formattedQuestion.length > 200
            ? formattedQuestion.slice(0, 200) + "..."
            : formattedQuestion;

        return (
          <div
            key={item.id}
            className="bg-white shadow-lg rounded-2xl p-5 hover:shadow-xl transition-all"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              👤 Punch No: <span className="text-blue-600">{item.punch_no}</span>
            </h3>

            <p className="text-sm text-gray-700 whitespace-pre-line mb-3">
              <strong>Question:</strong>{" "}
              {showFull ? formattedQuestion : shortQuestion}
            </p>

            {formattedQuestion.length > 200 && (
              <button
                onClick={() => setShowFull(!showFull)}
                className="text-blue-500 text-sm font-medium hover:underline"
              >
                {showFull ? "Read Less" : "Read More"}
              </button>
            )}

            <div className="flex items-center gap-2 mb-3">
              <strong>Marks:</strong>
              <span
                className={`px-3 py-1 rounded-full text-white text-sm ${
                  item.marks >= 8
                    ? "bg-green-500"
                    : item.marks >= 5
                    ? "bg-yellow-400 text-gray-800"
                    : "bg-red-500"
                }`}
              >
                {item.marks}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-3">
              <strong>Suggestion:</strong>{" "}
              {item.suggestion ? item.suggestion : "—"}
            </p>

            {item.video_url && (
              <video
                controls
                width="100%"
                height="180"
                className="rounded-xl border border-gray-200 mt-2"
              >
                <source
                  src={`http://127.0.0.1:8000/${item.video_url}`}
                  type="video/webm"
                />
                Your browser does not support the video tag.
              </video>
            )}

            <div className="mt-4 flex justify-end">
              {item.video_url ? (
                <a
                  href={`http://127.0.0.1:8000/${item.video_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 border border-blue-500 px-4 py-1 rounded-full text-sm hover:bg-blue-600 hover:text-white transition-all"
                >
                  View Full Video
                </a>
              ) : (
                <button
                  disabled
                  className="text-gray-400 border border-gray-300 px-4 py-1 rounded-full text-sm cursor-not-allowed"
                >
                  No Video
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>

    {/* Pagination Controls */}
    {totalPages > 1 && (
      <div className="flex justify-center items-center gap-3 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
        >
          ⬅ Prev
        </button>

        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
        >
          Next ➡
        </button>
      </div>
    )}
  </>
)}

    </div>
  );
}





