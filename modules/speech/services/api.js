export const sendAudioToBackend = async audioBlob => {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'audio.webm')

  try {
    const response = await fetch('/api/speech/process', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Backend API error:', error)
    throw error
  }
}
