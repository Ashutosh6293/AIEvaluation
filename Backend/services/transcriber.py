### today code##

# import os
# from pydub import AudioSegment
# import whisper

# # --- Ensure ffmpeg is available ---
# AudioSegment.converter = "ffmpeg"

# # --- Load Whisper model ---
# # Use medium or large for better Hindi accuracy
# model = whisper.load_model("small")

# def extract_audio(video_path, audio_path):
#     """
#     Extracts MP3 audio from video using ffmpeg (auto-detects format)
#     """
#     try:
#         if not os.path.exists(video_path):
#             raise FileNotFoundError(f"Video not found: {video_path}")

#         audio = AudioSegment.from_file(video_path)
#         audio = audio.set_frame_rate(16000).set_channels(1)
#         audio.export(audio_path, format="mp3")
#         print(f"[INFO] Audio extracted successfully to {audio_path}")

#     except Exception as e:
#         print(f"[ERROR] extract_audio failed: {e}")
#         raise


# def transcribe_audio(audio_path):
#     """
#     Transcribe MP3 using Whisper in Hindi language
#     """
#     try:
#         if not os.path.exists(audio_path):
#             raise FileNotFoundError(f"Audio not found: {audio_path}")

#         print(f"[INFO] Transcribing audio (Hindi mode): {audio_path}")
#         result = model.transcribe(audio_path, language="hi", fp16=False)
#         text = result.get("text", "").strip()

#         if not text:
#             print("[WARN] No speech detected in audio.")
#         else:
#             print("[INFO] Hindi transcription completed successfully.")

#         return text

#     except Exception as e:
#         print(f"[ERROR] transcribe_audio failed: {e}")
#         raise


###using vosk

import os
import wave
import json
import subprocess
from pydub import AudioSegment
from vosk import Model, KaldiRecognizer

# --- Ensure ffmpeg is available ---
AudioSegment.converter = "ffmpeg"

# --- Load Vosk Model (Hindi or English) ---
# Download model from: https://alphacephei.com/vosk/models
# Example: vosk-model-small-hi-0.22  (for Hindi)
#          vosk-model-small-en-in-0.22 (for English)
MODEL_PATH = "vosk-model-small-hi-0.22"

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Vosk model not found at '{MODEL_PATH}'. "
        "Download from https://alphacephei.com/vosk/models"
    )

vosk_model = Model(MODEL_PATH)


def extract_audio(video_path, audio_path):
    """
    Extracts MP3 audio from video using ffmpeg (auto-detects format)
    """
    try:
        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Video not found: {video_path}")

        audio = AudioSegment.from_file(video_path)
        audio = audio.set_frame_rate(16000).set_channels(1)
        audio.export(audio_path, format="wav")  # Export as WAV for Vosk
        print(f"[INFO] Audio extracted successfully to {audio_path}")

    except Exception as e:
        print(f"[ERROR] extract_audio failed: {e}")
        raise


def transcribe_audio(audio_path):
    """
    Transcribe WAV audio using Vosk (offline Hindi-English model)
    """
    try:
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio not found: {audio_path}")

        print(f"[INFO] Transcribing audio (Vosk Hindi-English): {audio_path}")

        # Convert to WAV (16kHz mono) if not already
        if not audio_path.lower().endswith(".wav"):
            temp_wav = "temp_audio.wav"
            subprocess.run(
                ["ffmpeg", "-i", audio_path, "-ar", "16000", "-ac", "1", temp_wav, "-y"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            audio_path = temp_wav

        wf = wave.open(audio_path, "rb")
        rec = KaldiRecognizer(vosk_model, wf.getframerate())
        rec.SetWords(True)

        results = []
        while True:
            data = wf.readframes(4000)
            if len(data) == 0:
                break
            if rec.AcceptWaveform(data):
                part = json.loads(rec.Result())
                results.append(part.get("text", ""))

        final = json.loads(rec.FinalResult())
        results.append(final.get("text", ""))

        transcript = " ".join(results).strip()

        if not transcript:
            print("[WARN] No speech detected in audio.")
        else:
            print("[INFO] Transcription completed successfully.")

        return transcript

    except Exception as e:
        print(f"[ERROR] transcribe_audio failed: {e}")
        raise

###AI4Bharat NeMo model

# import os
# import torch
# import torchaudio
# from pydub import AudioSegment
# from transformers import AutoModelForCTC, AutoProcessor

# # ===========================
# #  CONFIGURATION
# # ===========================
# MODEL_NAME = "ai4bharat/indicwav2vec-hindi"  # AI4Bharat NeMo-style model
# CHUNK_DURATION_MS = 60000  # 1 minute chunks
# device = "cpu"  # force CPU

# # ===========================
# #  LOAD MODEL
# # ===========================
# print("[INFO] Loading AI4Bharat IndicWav2Vec model (Hindi)...")
# processor = AutoProcessor.from_pretrained(MODEL_NAME)
# asr_model = AutoModelForCTC.from_pretrained(MODEL_NAME).to(device)
# torch.set_num_threads(4)  # optimize CPU performance
# print("[INFO] Model loaded successfully on CPU.")

# # ===========================
# #  AUDIO EXTRACTION
# # ===========================
# def extract_audio(video_path, audio_path):
#     """
#     Extracts WAV audio from video using ffmpeg (auto-detects format)
#     """
#     try:
#         if not os.path.exists(video_path):
#             raise FileNotFoundError(f"Video not found: {video_path}")

#         audio = AudioSegment.from_file(video_path)
#         audio = audio.set_frame_rate(16000).set_channels(1)
#         audio.export(audio_path, format="wav")
#         print(f"[INFO] Audio extracted successfully to {audio_path}")
#     except Exception as e:
#         print(f"[ERROR] extract_audio failed: {e}")
#         raise


# # ===========================
# #  TRANSCRIPTION (CHUNKED)
# # ===========================
# def transcribe_audio(audio_path):
#     """
#     Transcribe WAV audio using AI4Bharat IndicWav2Vec (Hindi, CPU)
#     Splits audio into smaller chunks for faster performance.
#     """
#     try:
#         if not os.path.exists(audio_path):
#             raise FileNotFoundError(f"Audio not found: {audio_path}")

#         print(f"[INFO] Transcribing audio using AI4Bharat model: {audio_path}")
#         audio = AudioSegment.from_file(audio_path)

#         # Split into 1-minute chunks
#         chunks = [audio[i:i + CHUNK_DURATION_MS] for i in range(0, len(audio), CHUNK_DURATION_MS)]
#         transcript = ""

#         for idx, chunk in enumerate(chunks):
#             print(f"[INFO] Processing chunk {idx + 1}/{len(chunks)}...")
#             temp_chunk_path = f"temp_chunk_{idx}.wav"
#             chunk.export(temp_chunk_path, format="wav")

#             # Load and resample
#             waveform, sr = torchaudio.load(temp_chunk_path)
#             if sr != 16000:
#                 resampler = torchaudio.transforms.Resample(sr, 16000)
#                 waveform = resampler(waveform)
#                 sr = 16000

#             # Model inference
#             inputs = processor(waveform.squeeze(), sampling_rate=sr, return_tensors="pt", padding=True)
#             with torch.no_grad():
#                 logits = asr_model(**inputs).logits
#             pred_ids = torch.argmax(logits, dim=-1)
#             text = processor.batch_decode(pred_ids)[0]

#             transcript += text.strip() + " "
#             os.remove(temp_chunk_path)

#         transcript = transcript.strip()

#         if not transcript:
#             print("[WARN] No speech detected in audio.")
#         else:
#             print("[INFO] Transcription completed successfully.")

#         return transcript

#     except Exception as e:
#         print(f"[ERROR] transcribe_audio failed: {e}")
#         raise
