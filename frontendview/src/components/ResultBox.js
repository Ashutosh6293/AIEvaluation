import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ResultBox({ result }) {
  if (!result) {
    return (
      <div className="p-3 text-center border rounded">
        No result yet.
      </div>
    );
  }

  const evalData = result.evaluation || {};
  const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Evaluation</h5>
        <p><strong>Score:</strong> {evalData.score ?? result.marks ?? "N/A"}/10</p>
        <p><strong>Strengths:</strong> {evalData.strengths ?? "-"}</p>
        <p><strong>Improvements:</strong> {evalData.improvements ?? result.suggestion ?? "-"}</p>
        <p><strong>Transcript:</strong></p>
        <pre className="p-2 bg-light rounded" style={{ whiteSpace: "pre-wrap" }}>
          {result.transcript ?? "[no transcript]"}
        </pre>
        {result.video_url && (
          <p>
            <a
              href={`${API_URL}${result.video_url}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-outline-primary"
            >
              View Video
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
