import Image from 'next/image'

import { Flex, Text } from '@radix-ui/themes'

import StartChat from '@/packages/asset/images/start-chat.png'

import { THEME } from '../../constant/styles'

const StartChatButton = ({ onClick }) => (
  <Flex direction='column' justify='center' height='100vh' align='center' gap='3'>
    <div className='rotating-border'>
      <Image src={StartChat} alt='' width={300} height='' onClick={onClick} />
    </div>
    <Text style={{ color: THEME.colors.text.primary, fontSize: '26px' }}>Start Chat</Text>
  </Flex>
)

export default StartChatButton
