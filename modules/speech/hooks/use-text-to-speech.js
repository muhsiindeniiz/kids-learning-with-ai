import { useCallback, useEffect, useRef, useState } from 'react'

import axios from 'axios'

const BASE_URL = 'https://api.elevenlabs.io/v1/text-to-speech'
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'

const DEFAULT_VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.5,
  style: 0.5,
  use_speaker_boost: true,
}

export const useTextToSpeech = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef(null)

  const convertTextToSpeech = async (text, apiKey) => {
    try {
      setIsLoading(true)

      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL`,
        {
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.7,
            similarity_boost: 0.7,
            style: 0.5,
            use_speaker_boost: true,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
          },
          responseType: 'blob',
        }
      )

      const speechBlob = new Blob([response.data], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(speechBlob)

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }

      setAudioUrl(url)

      if (audioRef.current) {
        audioRef.current.src = url
        await audioRef.current.play()
      }

      return url
    } catch (error) {
      console.error('Text to speech error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleAudioPlay = () => setIsAudioPlaying(true)
  const handleAudioPause = () => setIsAudioPlaying(false)
  const handleAudioEnded = () => setIsAudioPlaying(false)

  const resetAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
      setIsAudioPlaying(false)
    }
  }

  return {
    audioRef,
    audioUrl,
    isAudioPlaying,
    isLoading,
    convertTextToSpeech,
    resetAudio,
    audioEventHandlers: {
      onPlay: handleAudioPlay,
      onPause: handleAudioPause,
      onEnded: handleAudioEnded,
    },
  }
}
