import { useCallback, useState } from 'react'

export const useChatMessages = () => {
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchMessages = useCallback(async sessionId => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/chat/sessions/${sessionId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        setMessages(data.messages || [])
        return data.messages
      } else {
        throw new Error(data.error || 'Failed to fetch messages')
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setError('Failed to fetch messages')
      setMessages([])
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    messages,
    error,
    isLoading,
    fetchMessages,
  }
}
