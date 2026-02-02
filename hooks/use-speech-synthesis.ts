"use client"

import { useState, useCallback, useRef, useEffect } from 'react'

export function useSpeechSynthesis() {
  const [isReading, setIsReading] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Check if speech synthesis is supported - more robust check
  useEffect(() => {
    const checkSupport = () => {
      if (typeof window !== 'undefined' &&
          'speechSynthesis' in window &&
          typeof window.speechSynthesis !== 'undefined') {
        setIsSupported(true)
      }
    }

    // Check immediately
    checkSupport()

    // Also check after a short delay in case voices need to load
    const timeoutId = setTimeout(checkSupport, 100)

    return () => clearTimeout(timeoutId)
  }, [])

  const readPageContent = useCallback(() => {
    if (!isSupported) {
      return
    }

    // If already reading, stop
    if (isReading) {
      try {
        window.speechSynthesis.cancel()
      } catch (error) {
        // Ignore errors when canceling
      }
      setIsReading(false)
      return
    }

    try {
      // Find the main content area
      const mainElement = document.querySelector('main')
      let textContent = ''

      if (mainElement) {
        // Simple approach: get all text content and clean it up
        textContent = mainElement.textContent || mainElement.innerText || ''

        // Clean up the text
        textContent = textContent
          .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
          .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
          .trim()
      }

      if (!textContent.trim()) {
        return
      }

      // Create speech utterance
      const utterance = new SpeechSynthesisUtterance(textContent)

      // Use default voice (usually Google voice in Chrome)
      const voices = window.speechSynthesis.getVoices()
      const defaultVoice = voices.find(voice =>
        voice.name.toLowerCase().includes('google') ||
        voice.name.toLowerCase().includes('english') ||
        voice.default
      ) || voices[0] // Fallback to first available voice

      if (defaultVoice) {
        utterance.voice = defaultVoice
      }

      // Set speech properties
      utterance.rate = 0.9 // Slightly slower than default
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onstart = () => setIsReading(true)
      utterance.onend = () => setIsReading(false)
      utterance.onerror = () => setIsReading(false)

      // Store reference for cleanup
      utteranceRef.current = utterance

      // Start speaking
      window.speechSynthesis.speak(utterance)
    } catch (error) {
      setIsReading(false)
    }
  }, [isSupported, isReading])

  const stopReading = useCallback(() => {
    if (isSupported) {
      try {
        window.speechSynthesis.cancel()
      } catch (error) {
        // Ignore errors when canceling
      }
      setIsReading(false)
    }
  }, [isSupported])

  return {
    isReading,
    isSupported,
    readPageContent,
    stopReading
  }
}