import { useCallback, useEffect, useState } from 'react'

export const useAudioPermission = () => {
  const [hasPermission, setHasPermission] = useState(null)
  const [permissionError, setPermissionError] = useState('')

  const checkPermission = useCallback(async () => {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: 'microphone',
      })

      if (permissionStatus.state === 'granted') {
        setHasPermission(true)
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      setHasPermission(true)
      setPermissionError('')
    } catch (error) {
      console.error('Permission check error:', error)
      setHasPermission(false)
      setPermissionError('Please allow microphone access in your browser settings.')
    }
  }, [])

  // Check permissions when component mounts
  useEffect(() => {
    checkPermission()
  }, [checkPermission])

  return {
    hasPermission,
    permissionError,
    checkPermission,
  }
}
