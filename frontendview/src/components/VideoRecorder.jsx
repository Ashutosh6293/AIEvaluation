import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function VideoRecorder({ onSubmit, employeeId, question,  isLastQuestion,onRecordingChange   }) {
  const videoRef = useRef(null);
  const previewRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
   const [uploading, setUploading] = useState(false);
   const [compressing, setCompressing] = useState(false);

  // Timer effect
  useEffect(() => {
    let id;
    if (isRecording) {
      id = setInterval(() => setTimer((t) => t + 1), 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(id);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      setRecordedChunks([]); // reset chunks at start

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) setRecordedChunks((prev) => [...prev, e.data]);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTimer(0);

       if (onRecordingChange) onRecordingChange(true);
    } catch (err) {
      console.error("Failed to access camera/microphone:", err);
      alert("Cannot access camera or microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      setIsRecording(false);

       if (onRecordingChange) onRecordingChange(false);
    }
  };
  // Compress video before upload
  const compressVideo = async (blob) => {
    setCompressing(true);

    if (!ffmpeg.isLoaded()) await ffmpeg.load();

    ffmpeg.FS("writeFile", "input.webm", await fetchFile(blob));

    // Compress: reduce resolution & bitrate
    await ffmpeg.run(
      "-i",
      "input.webm",
      "-vcodec",
      "libvpx",
      "-b:v",
      "500k",
      "-acodec",
      "libvorbis",
      "output.webm"
    );

    const data = ffmpeg.FS("readFile", "output.webm");
    const compressedBlob = new Blob([data.buffer], { type: "video/webm" });
    setCompressing(false);
    return compressedBlob;
    
  };


  const handleSubmit = async () => {
    if (recordedChunks.length === 0) {
      alert("No video recorded.");
      return;
    }

    setUploading(true);

    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const formData = new FormData();
    formData.append("employee_id", (employeeId)); // must pass from Assessment
    formData.append("question", question);       // current question
    formData.append("file", blob, `answer_${Date.now()}.webm`);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload_answer/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      alert("Video uploaded successfully!");
      if (onSubmit) onSubmit(blob, data); // pass backend result
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    }finally {
      setUploading(false); // ✅ Stop loading
      setRecordedChunks([]);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center gap-3">
      {/* Live Stream */}
      <video
        ref={videoRef}
        autoPlay
        muted
        className="border mb-2"
        style={{ width: "480px", height: "360px", backgroundColor: "#000" }}
      />

      {/* Timer */}
      {isRecording && <h5>⏱ {timer}s</h5>}

      {/* Control Buttons */}
      <div className="d-flex gap-2">
        <button onClick={startRecording} className="btn btn-success" disabled={isRecording || isLastQuestion}>
          Start
        </button>
        <button onClick={stopRecording} className="btn btn-danger" disabled={!isRecording || !isLastQuestion}>
          Stop
        </button>
        <button
          onClick={handleSubmit}
          className="btn btn-primary d-flex align-items-center gap-2"
          disabled={recordedChunks.length === 0 || uploading}
        >
          {uploading ? (
            <>
              <span
                className="spinner-border spinner-border-sm text-light"
                role="status"
                aria-hidden="true"
              ></span>
              Uploading...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </div>

      {/* Preview Recorded Video */}
      {/* {previewUrl && (
        <div className="mt-3">
          <h6>Preview:</h6>
          <video
            ref={previewRef}
            src={previewUrl}
            controls
            style={{ width: "480px", height: "360px", backgroundColor: "#000" }}
          />
        </div>
      )} */}
    </div>
  );
}









