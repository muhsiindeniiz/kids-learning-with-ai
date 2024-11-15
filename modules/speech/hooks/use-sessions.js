import { useCallback, useState } from 'react'

export const useSessions = () => {
  const [sessions, setSessions] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/chat/sessions')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

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
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createSession = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch('/api/chat/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        await fetchSessions()
        return data.sessionId
      } else {
        throw new Error(data.error || 'Failed to create session')
      }
    } catch (error) {
      console.error('Error creating session:', error)
      setError('Failed to create session')
      return null
    }
  }, [fetchSessions])

  return {
    sessions,
    error,
    isLoading,
    fetchSessions,
    createSession,
  }
}
