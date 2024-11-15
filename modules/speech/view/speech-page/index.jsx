'use client'

import dynamic from 'next/dynamic'

import { Flex } from '@radix-ui/themes'

const SpeechRecorder = dynamic(
  () => import('@/modules/speech/component/speech-recorder'),
  { ssr: false }
)

const ChatInterface = dynamic(() => import('@/modules/speech/component/chat-interface'), {
  ssr: false,
})

const SpeechPage = () => {
  return (
    <Flex justify='center'>
      {/* <SpeechRecorder /> */}
      <ChatInterface />
    </Flex>
  )
}

export default SpeechPage
