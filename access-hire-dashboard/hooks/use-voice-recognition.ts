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
        const transcript = event.results[0][0].transcript
        setState(prev => ({ ...prev, transcript, isListening: false }))
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
    } else {
      setState(prev => ({ ...prev, isSupported: false, error: 'Voice recognition is not supported in this browser.' }))
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
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