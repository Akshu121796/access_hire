"use client"

import { useState, useEffect, useCallback } from 'react'

interface VoiceRecognitionState {
  isListening: boolean
  transcript: string
  isSupported: boolean
  error: string | null
}

export function useVoiceRecognition() {
  const [state, setState] = useState<VoiceRecognitionState>({
    isListening: false,
    transcript: '',
    isSupported: false,
    error: null,
  })

  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    // Check if browser supports speech recognition
    if (typeof window === 'undefined') return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'en-US'

      recognitionInstance.onstart = () => {
        setState(prev => ({ ...prev, isListening: true, error: null }))
      }

      recognitionInstance.onresult = (event) => {
        try {
          if (event.results && event.results[0] && event.results[0][0]) {
            const transcript = event.results[0][0].transcript
            setState(prev => ({ ...prev, transcript, isListening: false }))
          } else {
            console.warn("Voice recognition returned empty results")
          }
        } catch (err) {
          console.error("Error processing voice recognition result:", err)
          setState(prev => ({
            ...prev,
            isListening: false,
            error: "Failed to process voice input. Please try again."
          }))
        }
      }

      recognitionInstance.onerror = (event) => {
        setState(prev => ({
          ...prev,
          isListening: false,
          error: event.error === 'not-allowed'
            ? 'Microphone access denied. Please allow microphone access to use voice search.'
            : `Voice recognition error: ${event.error}`
        }))
      }

      recognitionInstance.onend = () => {
        setState(prev => ({ ...prev, isListening: false }))
      }

      setRecognition(recognitionInstance)
      setState(prev => ({ ...prev, isSupported: true }))

      return () => {
        recognitionInstance.stop()
      }
    } else {
      setState(prev => ({ ...prev, isSupported: false, error: 'Voice recognition is not supported in this browser.' }))
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognition && !state.isListening) {
      try {
        recognition.start()
      } catch (error) {
        setState(prev => ({ ...prev, error: 'Failed to start voice recognition.' }))
      }
    }
  }, [recognition, state.isListening])

  const stopListening = useCallback(() => {
    if (recognition && state.isListening) {
      recognition.stop()
    }
  }, [recognition, state.isListening])

  const clearTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '', error: null }))
  }, [])

  return {
    ...state,
    startListening,
    stopListening,
    clearTranscript,
  }
}