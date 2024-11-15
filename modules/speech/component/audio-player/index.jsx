import { forwardRef, useEffect } from 'react'

const AudioPlayer = forwardRef(({ src, onPlay, onPause, onEnded }, ref) => {
  useEffect(() => {
    const audio = ref.current
    if (audio && src) {
      // Önceki oynatmayı durdur
      audio.pause()
      // Audio'yu başa sar
      audio.currentTime = 0
      // Yeni kaynağı ayarla
      audio.src = src

      // Ses yüklendiğinde oynat
      const playAudio = () => {
        audio
          .play()
          .then(() => {
            console.log('Audio started playing automatically')
          })
          .catch(error => {
            if (error.name !== 'AbortError') {
              console.error('Audio playback failed:', error)
            }
          })
      }

      audio.addEventListener('loadeddata', playAudio)

      return () => {
        audio.removeEventListener('loadeddata', playAudio)
        audio.pause()
      }
    }
  }, [src, ref])

  return (
    <audio
      ref={ref}
      controls
      onPlay={onPlay}
      onPause={onPause}
      hidden
      onEnded={onEnded}
      style={{
        width: '250px',
        height: '40px',
      }}
    />
  )
})

AudioPlayer.displayName = 'AudioPlayer'

export default AudioPlayer
