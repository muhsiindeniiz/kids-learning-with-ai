import * as Tooltip from '@radix-ui/react-tooltip'
import { Button } from '@radix-ui/themes'
import { Mic, MicOff } from 'lucide-react'

const RecordButton = ({
  isRecording,
  hasPermission,
  isProcessing,
  permissionError,
  onMouseDown,
}) => {
  const buttonContent = (
    <Button
      size='4'
      style={{
        width: '160px',
        height: '160px',
        borderRadius: '100%',
        transform: isRecording ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform 0.2s',
        background: isRecording ? 'var(--red-a9)' : 'var(--blue-a9)',
        cursor: hasPermission ? 'pointer' : 'not-allowed',
        touchAction: 'none',
        userSelect: 'none',
        opacity: hasPermission === null ? 0.7 : 1,
      }}
      onMouseDown={onMouseDown}
      disabled={isProcessing || !hasPermission}
    >
      {isRecording ? (
        <Mic size={64} color='white' style={{ animation: 'pulse 2s infinite' }} />
      ) : (
        <MicOff size={64} color='white' />
      )}
    </Button>
  )

  if (permissionError || hasPermission === null) {
    return (
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button className='IconButton'>
              {permissionError || 'Checking microphone permission...'}
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className='TooltipContent' sideOffset={5}>
              {buttonContent}
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    )
  }

  return buttonContent
}

export default RecordButton
