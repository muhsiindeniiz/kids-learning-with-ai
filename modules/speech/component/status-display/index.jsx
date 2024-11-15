import Image from 'next/image'

import { Box, Flex, Text } from '@radix-ui/themes'

import aiTalkWave from '@/packages/asset/images/ai-talk-wave.gif'
import loadingGif from '@/packages/asset/images/loading-ai.gif'

const StatusDisplay = ({ isProcessing, isAudioPlaying, response }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
  }
  console.log(isAudioPlaying)

  if (isProcessing) {
    return (
      <Box style={containerStyle}>
        <Image
          src={loadingGif}
          alt='Processing'
          width={250}
          height={200}
          style={{
            height: 'auto',
            objectFit: 'contain',
            margin: '0 auto',
          }}
        />
      </Box>
    )
  }

  if (isAudioPlaying) {
    return (
      <Box style={containerStyle}>
        <Image
          src={aiTalkWave}
          alt='AI Speaking'
          width={250}
          height={200}
          style={{
            height: 'auto',
            objectFit: 'contain',
            margin: '0 auto',
          }}
        />
      </Box>
    )
  }

  return (
    <Box
      p='4'
      style={{
        background: 'white',
        borderRadius: 'var(--radius-4)',
        maxWidth: '500px',
        width: '100%',
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <Text size='6' color='blue'>
        {response}
      </Text>
    </Box>
  )
}

export default StatusDisplay
