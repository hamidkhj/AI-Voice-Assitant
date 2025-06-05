import React, { useEffect, useRef, useState } from 'react'
import Lottie from 'lottie-react'

// Lottie animations
import userIdle from './assets/idle.json'
import userTalking from './assets/user_talking.json'
import aiThinking from './assets/ai_thinking.json'
import aiTalking from './assets/ai_talking.json'

export default function Recorder() {
  const [status, setStatus] = useState('loading') // loading | uploading | idle | recording | thinking | speaking | text
  const [answerText, setAnswerText] = useState('')
  const [backendReady, setBackendReady] = useState(false)
  const [docUploaded, setDocUploaded] = useState(false)

  const mediaStream = useRef(null)
  const mediaRecorder = useRef(null)
  const chunks = useRef([])
  const audioRef = useRef(null)
  const conversationHistory = useRef([])


  const backendURL = 'https://ipa-backend-4ca7.onrender.com'
  // const backendURL = 'http://127.0.0.1:8000'

  useEffect(() => {
    const checkBackend = () => {
      fetch(`${backendURL}/ping`)
        .then(res => {
          if (res.ok) {
            setBackendReady(true)
            setStatus('uploading')
            console.log('backend is ready')
          } else {
            throw new Error('Backend not ready')
          }
        })
        .catch(() => {
          console.log('Backend not ready. Retrying in 20s...')
          setTimeout(checkBackend, 20000)
        })
    }

    checkBackend()
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStream.current = stream
      mediaRecorder.current = new MediaRecorder(stream)
      setStatus('recording')

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data)
        }
      }

      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: 'audio/mp3' })
        chunks.current = []
        mediaStream.current.getTracks().forEach(track => track.stop())
        sendAudio(recordedBlob)
      }

      mediaRecorder.current.start()
    } catch (error) {
      console.error('Recording error:', error)
      setStatus('idle')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop()
      setStatus('thinking')
    }
  }

  const sendAudio = (audio) => {
    const formData = new FormData()
    formData.append('file', audio, 'audio.mp3')

    if (conversationHistory.current.length > 5) {
    conversationHistory.current = conversationHistory.current.slice(-5)
    }
    formData.append('history', JSON.stringify(conversationHistory.current))
    console.log(conversationHistory.current)

    fetch(`${backendURL}/transcribe`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        console.log('Transcription:', data.transcription)
        console.log('Answer:', data.answer[0])
        setAnswerText(data.answer[0])
        conversationHistory.current.push({
          question: data.transcription,
          answer: data.answer[0]
        })
        speakText(data.answer[0])
      })
      .catch(err => {
        console.error('Upload error:', err)
        setStatus('idle')
      })
  }

  const speakText = async (text) => {
    try {
      const response = await fetch(`${backendURL}/speak`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      })

      if (!response.ok) throw new Error("Failed to fetch audio stream")

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      if (audioRef.current) {
        audioRef.current.src = url
        setStatus('speaking')
        await audioRef.current.play()
        audioRef.current.onended = () => setStatus('text')
      }
    } catch (error) {
      console.error("Speaking error:", error)
      setStatus('text')
    }
  }

  const handleShowText = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setStatus('text')
  }

  const handleReset = () => {
    setAnswerText('')
    setStatus('idle')
  }

  const getAnimation = () => {
    switch (status) {
      case 'recording': return userTalking
      case 'thinking': return aiThinking
      case 'speaking': return aiTalking
      default: return userIdle
    }
  }


  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setStatus('uploading')

    try {
      const res = await fetch(`${backendURL}/upload`, {
        method: 'POST',
        body: formData,
      })

      const result = await res.json()
      if (res.ok && result.message === 'Document indexed') {
        console.log('Document uploaded and processed')
        setDocUploaded(true)
        setStatus('idle')
      } else {
        throw new Error('Backend did not process document')
      }
    } catch (err) {
      console.error('Document upload failed:', err)
      alert("Failed to upload and process document.")
      setStatus('uploading')
    }
  }

  if (!backendReady) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white text-xl">
        <Lottie animationData={aiThinking} loop className="w-64 h-64" />
        <p className="mt-4">Waking up your assistant...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
      <Lottie animationData={getAnimation()} loop className="w-64 h-64" />

      {status === 'uploading' && (
        <div className="flex flex-col items-center gap-4 mt-6 text-white">
          <p className="text-xl">Upload your document to get started. This app will allow you to talk to an assistant about your uploaded document.</p>
          <input
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={handleFileUpload}
            className="bg-white text-black rounded px-4 py-2"
          />
        </div>
      )}

      {status === 'idle' && (
        <button onClick={startRecording} className="mt-6 text-[30px] bg-blue-600 text-white px-6 py-3 rounded-full">
          Start Talking
        </button>
      )}

      {status === 'recording' && (
        <button onClick={stopRecording} className="mt-6 text-[30px] bg-red-600 text-white px-6 py-3 rounded-full">
          Stop
        </button>
      )}

      {status === 'speaking' && (
        <button onClick={handleShowText} className="mt-6 text-[20px] bg-yellow-500 text-black px-4 py-2 rounded-lg">
          Show Text Instead
        </button>
      )}

      {status === 'text' && (
        <div className="flex flex-col items-center gap-4 mt-6 text-white text-lg text-center max-w-2xl">
          <p className="bg-black bg-opacity-40 p-4 rounded-lg">{answerText}</p>
          <button onClick={handleReset} className="text-[20px] bg-green-600 text-white px-6 py-3 rounded-full">
            Ask Another Question
          </button>
        </div>
      )}

      <audio ref={audioRef} hidden />
    </div>
  )
}
