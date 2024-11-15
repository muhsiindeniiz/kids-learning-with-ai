import { Button, Flex, Text } from '@radix-ui/themes'
import { format } from 'date-fns'
import { MessageCircle, X } from 'lucide-react'

import { getFirstFourWords } from '@/modules/speech/utils/text-formatting'

import { THEME } from '../../constant/styles'

const SessionGroup = ({ group, sessions, onSessionClick }) => (
  <Flex key={group} direction='column' gap='2' mb='4' style={{ width: '100%' }}>
    <Text
      size='2'
      style={{ color: THEME.colors.text.muted, fontWeight: 500, padding: '0 12px' }}
    >
      {group}
    </Text>
    {sessions.map(session => (
      <Flex
        direction='column'
        key={session.id}
        style={{ marginBottom: '8px' }}
        className='session-history'
        width='100%'
      >
        <Button
          variant='ghost'
          onClick={() => onSessionClick(session.id)}
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            background: 'transparent',
            color: THEME.colors.text.primary,
            padding: '12px',
            cursor: 'pointer',
            borderRadius: '6px',
            ':hover': {
              background: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <Flex direction='column' align='start' gap='1' style={{ width: '100%' }}>
            <Flex align='center' gap='2'>
              <MessageCircle size={16} />
              {format(new Date(session.createdAt), 'HH:mm')}
            </Flex>
            {session.messages && session.messages[0] && (
              <Text
                size='1'
                style={{
                  color: THEME.colors.text.muted,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '180px',
                  textAlign: 'left',
                  marginTop: 5,
                }}
              >
                {getFirstFourWords(session.messages[0].userInput)}
              </Text>
            )}
          </Flex>
        </Button>
      </Flex>
    ))}
  </Flex>
)

export default SessionGroup
