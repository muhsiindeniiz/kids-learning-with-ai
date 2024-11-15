import * as Dialog from '@radix-ui/react-dialog'
import { Box, Button, Flex, ScrollArea, Text } from '@radix-ui/themes'
import { format } from 'date-fns'
import { X } from 'lucide-react'

import { THEME } from '../../constant/styles'

const ChatDialog = ({ isOpen, onClose, messages }) => (
  <Dialog.Root open={isOpen} onOpenChange={onClose}>
    <Dialog.Portal>
      <Dialog.Overlay
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 999,
        }}
      />
      <Dialog.Content>
        <Box
          position='fixed'
          top='50%'
          left='50%'
          style={{
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            width: '90%',
            maxWidth: '550px',
            background: THEME.colors.background.dialog,
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            border: `1px solid ${THEME.colors.border}`,
          }}
        >
          {/* Header */}
          <Flex
            justify='between'
            align='center'
            style={{
              padding: '20px 24px',
              borderBottom: `1px solid ${THEME.colors.border}`,
              background: 'rgba(255,255,255,0.05)',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
            }}
          >
            <Dialog.Title>
              <Text
                size='5'
                weight='medium'
                style={{
                  color: THEME.colors.text.primary,
                  letterSpacing: '0.5px',
                }}
              >
                Chat History
              </Text>
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button
                variant='ghost'
                style={{
                  color: THEME.colors.text.muted,
                  borderRadius: '8px',
                  ':hover': {
                    background: 'rgba(255,255,255,0.1)',
                    color: THEME.colors.text.primary,
                  },
                }}
              >
                <X size={20} />
              </Button>
            </Dialog.Close>
          </Flex>

          {/* Content */}
          <Box style={{ padding: '24px' }}>
            <ScrollArea
              style={{
                height: '60vh',
                maxHeight: '600px',
              }}
            >
              <Flex direction='column' gap='4'>
                {messages.map(message => (
                  <Box
                    key={message.id}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      marginBottom: 20,
                      borderRadius: '12px',
                      padding: '16px',
                      border: `1px solid ${THEME.colors.border.primary}`,
                      transition: 'all 0.2s ease',
                      ':hover': {
                        background: 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    <Flex direction='column' gap='3'>
                      {/* Question */}
                      <Box>
                        <Text
                          weight='medium'
                          style={{
                            color: THEME.colors.text.muted,
                            fontSize: '13px',
                            marginBottom: '4px',
                          }}
                        >
                          Question:
                        </Text>
                        <Text style={{ color: THEME.colors.text.secondary }}>
                          {message.userInput}
                        </Text>
                      </Box>

                      {/* Answer */}
                      <Box>
                        <Text
                          weight='medium'
                          style={{
                            color: THEME.colors.text.muted,
                            fontSize: '13px',
                            marginBottom: '4px',
                          }}
                        >
                          Answer:
                        </Text>
                        <Text style={{ color: THEME.colors.text.secondary }}>
                          {message.aiResponse}
                        </Text>
                      </Box>

                      {/* Timestamp */}
                      <Text
                        size='1'
                        style={{
                          color: THEME.colors.text.primary,
                          fontSize: '12px',
                          marginTop: '4px',
                        }}
                      >
                        {format(new Date(message.timestamp), 'HH:mm')}
                      </Text>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            </ScrollArea>
          </Box>
        </Box>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)

export default ChatDialog
