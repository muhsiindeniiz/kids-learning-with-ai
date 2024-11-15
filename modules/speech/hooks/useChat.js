import { useCallback, useEffect, useState } from 'react'

export const useChat = () => {
  const [sessions, setSessions] = useState([])
  const [currentSession, setCurrentSession] = useState(null)
  const [selectedSessionMessages, setSelectedSessionMessages] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showRecorder, setShowRecorder] = useState(false)
  const [error, setError] = useState(null)

  const fetchSessions = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch('/api/chat/sessions')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()
      if (data.success) {
        setSessions(data.sessions || [])
      } else {
        throw new Error(data.error || 'Failed to fetch sessions')
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
      setError('Failed to fetch sessions')
      setSessions([])
    }
  }, [])

  const startNewSession = async () => {
    try {
      setError(null)
      const response = await fetch('/api/chat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()
      if (data.success) {
        setCurrentSession(data.sessionId)
        setShowRecorder(true)
        await fetchSessions()
      } else {
        throw new Error(data.error || 'Failed to create session')
      }
    } catch (error) {
      console.error('Error starting session:', error)
      setError('Failed to start session')
    }
  }

  const fetchSessionMessages = async sessionId => {
    try {
      setError(null)
      const response = await fetch(`/api/chat/sessions/${sessionId}`)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()
      if (data.success) {
        setSelectedSessionMessages(data.messages || [])
        setIsDialogOpen(true)
      } else {
        throw new Error(data.error || 'Failed to fetch messages')
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setError('Failed to fetch messages')
      setSelectedSessionMessages([])
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  return {
    sessions,
    currentSession,
    selectedSessionMessages,
    isDialogOpen,
    showRecorder,
    error,
    startNewSession,
    fetchSessionMessages,
    setIsDialogOpen,
    setShowRecorder,
  }
}
