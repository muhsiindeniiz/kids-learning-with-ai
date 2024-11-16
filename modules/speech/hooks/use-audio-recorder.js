'use client'

import { useCallback, useEffect, useState } from 'react'

const DEFAULT_AUDIO_SETTINGS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
}

export const useAudioRecorder = () => {
  const [state, setState] = useState({
    isRecording: false,
    hasPermission: false,
    permissionError: null,
    recordingDuration: 0,
  })

  const [recorder] = useState(() => {
    const mediaRecorder = {
      instance: null,
      chunks: [],
      stream: null,
      recordingStartTime: null,
    }
    return mediaRecorder
  })

  const checkPermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' })
      setState(prev => ({
        ...prev,
        hasPermission: result.state === 'granted',
        permissionError: null,
      }))
      return result.state === 'granted'
    } catch (error) {
      setState(prev => ({
        ...prev,
        hasPermission: false,
        permissionError: error,
      }))
      throw error
    }
  }, [])

  const initializeMediaStream = useCallback(
    async (settings = DEFAULT_AUDIO_SETTINGS) => {
      if (recorder.stream) {
        recorder.stream.getTracks().forEach(track => track.stop())
      }

      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: settings,
        })
        recorder.stream = newStream
        return newStream
      } catch (error) {
        console.error('Error accessing microphone:', error)
        await checkPermission()
        throw error
      }
    },
    [recorder, checkPermission]
  )

  const startRecording = useCallback(async () => {
    try {
      const audioStream = await initializeMediaStream()
      const mediaRecorder = new MediaRecorder(audioStream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000,
      })

      recorder.chunks = []
      recorder.recordingStartTime = Date.now()

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          recorder.chunks.push(event.data)
        }
      }

      mediaRecorder.onstart = () => {
        setState(prev => ({
          ...prev,
          isRecording: true,
          recordingDuration: 0,
        }))
      }

      recorder.instance = mediaRecorder
      mediaRecorder.start(1000)
    } catch (error) {
      console.error('Start recording error:', error)
      throw error
    }
  }, [recorder, initializeMediaStream])

  const stopRecording = useCallback(async () => {
    if (!recorder.instance || !state.isRecording) return null

    return new Promise(resolve => {
      recorder.instance.onstop = () => {
        const duration = (Date.now() - recorder.recordingStartTime) / 1000
        setState(prev => ({
          ...prev,
          isRecording: false,
          recordingDuration: duration,
        }))

        const audioBlob = new Blob(recorder.chunks, {
          type: 'audio/webm;codecs=opus',
        })
        resolve(audioBlob)
      }

      recorder.instance.stop()

      setTimeout(() => {
        if (recorder.stream) {
          recorder.stream.getTracks().forEach(track => track.stop())
          recorder.stream = null
        }
      }, 100)
    })
  }, [recorder, state.isRecording])

  useEffect(() => {
    checkPermission()
    return () => {
      if (recorder.stream) {
        recorder.stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [checkPermission, recorder])

  return {
    isRecording: state.isRecording,
    hasPermission: state.hasPermission,
    permissionError: state.permissionError,
    recordingDuration: state.recordingDuration,
    startRecording,
    stopRecording,
    checkPermission,
  }
}
