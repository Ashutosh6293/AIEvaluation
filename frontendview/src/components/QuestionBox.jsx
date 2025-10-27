import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function QuestionBox({ question }) {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Question</h5>
        <p className="card-text">{question}</p>
      </div>
    </div>
  );
}
