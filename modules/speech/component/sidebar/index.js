import { Box, Flex, ScrollArea, Text } from '@radix-ui/themes'

import { THEME } from '../../constant/styles'
import { groupSessionsByDate } from '../../utils/date-grouping'
import SessionGroup from '../session-group'

const Sidebar = ({ sessions, onSessionClick }) => (
  <Box
    position='fixed'
    left='0'
    top='0'
    width='260px'
    height='100vh'
    style={{ background: THEME.colors.background.primary }}
  >
    <Flex direction='column' p='4' height='100%' style={{ padding: '20px' }}>
      <Text size='5' mb='4' style={{ color: THEME.colors.text.secondary }}>
        Chat History
      </Text>

      <ScrollArea style={{ width: '100%', marginTop: 20 }}>
        {Object.entries(groupSessionsByDate(sessions)).map(([group, groupSessions]) => (
          <SessionGroup
            key={group}
            group={group}
            sessions={groupSessions}
            onSessionClick={onSessionClick}
          />
        ))}
      </ScrollArea>
    </Flex>
  </Box>
)

export default Sidebar
