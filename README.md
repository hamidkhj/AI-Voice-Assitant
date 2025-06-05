# 🧠 AI Voice Assistant — Talk to Your Documents

Imagine uploading a document and having a conversation with it — using your voice.

This full-stack AI app lets you do just that: **upload any `.txt`, `.pdf`, or `.docx` file, ask questions by voice, and receive spoken responses**, grounded in your uploaded content.

> ⚡ Built with FastAPI, React, and Retrieval-Augmented Generation (RAG) using open-source LLMs and APIs.

---

## 🔍 Features

- 🎙️ **Voice Input** — Speak your question using your microphone
- 📄 **Document Upload** — Upload any `.txt`, `.pdf`, or `.docx` file
- 🔎 **RAG Pipeline** — Retrieves relevant document chunks using Cohere embeddings
- 🤖 **LLM Answers** — Generates answers using Together AI's LLaMA-3
- 🔊 **Voice Output** — Listens back using ElevenLabs Text-to-Speech
- 🔁 **Short-Term Memory** — Remembers the last 5 Q&A pairs for conversational flow
- 💻 **Deployed on Render** (free tier — see notes below)

---

## 🚀 Live Demo (optional)

[(https://mypersonalassistant.vercel.app/)]
_(⚠️ May take ~30–180 seconds to load if hibernating — free tier Render goes idle after 15 minutes)_

---

## 📦 Tech Stack

### 🔧 Backend (`/backend`)
- **FastAPI** (REST API)
- **Deepgram API** — Speech-to-text
- **Cohere API** — Text embeddings
- **Together AI** — LLM completion (LLaMA-3)
- **ElevenLabs API** — Text-to-speech
- **PyPDF2**, `python-docx` — File parsing
- **RAG logic** — Chunking + similarity search + LLM

### 💻 Frontend (`/frontend`)
- **React** (Vite)
- **Lottie animations** for UI feedback
- **Audio recording** via `navigator.mediaDevices`
- **Conversation memory** (up to 5 turns)
- **Async API calls** to backend

---

## 📁 Project Structure
ai-voice-assistant/
├── frontend/ # React app
├── backend/ # FastAPI app
└── README.md # You're here!


## 🔑 API Keys Required
Create a .env file in backend/ with:

- DEEPGRAM_API_KEY=your_deepgram_key
- COHERE_API_KEY=your_cohere_key
- TOGATHERAI_API_KEY=your_togetherai_key
- ELEVENLABS_API_KEY=your_elevenlabs_key

## ⭐️ Contributing
Suggestions, pull requests, and feedback are welcome!

## 🙋‍♂️ About Me
Hi, I'm Hamid Kouhpeimay Jahromi, a master's student in Data Science and aspiring Machine Learning Engineer.
This project was built to explore real-world voice interfaces using Retrieval-Augmented Generation and multi-modal AI.

Feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/hamid-kouhpeimay-jahromi-05893516a/) or reach out if you want to collaborate!
