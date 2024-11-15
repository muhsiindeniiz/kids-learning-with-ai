import { Box, Flex, Text } from '@radix-ui/themes'

import { THEME } from '../../constant/styles'
import { useChat } from '../../hooks/useChat'
import ChatDialog from '../chat-dialog'
import Sidebar from '../sidebar'
import SpeechRecorder from '../speech-recorder'
import StartChatButton from '../start-chat'

const ChatInterface = () => {
  const {
    sessions,
    currentSession,
    selectedSessionMessages,
    isDialogOpen,
    showRecorder,
    error,
    startNewSession,
    fetchSessionMessages,
    setIsDialogOpen,
  } = useChat()

  return (
    <Flex width='100%'>
      <Sidebar sessions={sessions} onSessionClick={fetchSessionMessages} />

      <Box
        style={{
          marginLeft: '260px',
          width: 'calc(100% - 240px)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Flex direction='column' justify='center' width='100%' p='6' position='relative'>
          {error && (
            <Box
              position='absolute'
              top='4'
              p='3'
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Text color='red' align='center'>
                {error}
              </Text>
            </Box>
          )}

          <Flex align='center' justify='center' width='100%'>
            {!showRecorder ? (
              <StartChatButton onClick={startNewSession} />
            ) : (
              <SpeechRecorder sessionId={currentSession} />
            )}
          </Flex>
        </Flex>
      </Box>

      <ChatDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        messages={selectedSessionMessages}
      />
    </Flex>
  )
}

export default ChatInterface
