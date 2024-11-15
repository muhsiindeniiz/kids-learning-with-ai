import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'
import { OpenAI } from 'openai'

import { env } from '@/env'
import { SYSTEM_PROMPT } from '@/packages/constant/speech-ai-prompts'

const prisma = new PrismaClient()
const openai = new OpenAI({
  apiKey: env.openaiApiKey,
})

const ELEVEN_LABS_API_KEY = env.elevenLabsApiKey

export async function POST(request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio')
    const sessionId = formData.get('sessionId')

    console.log('Received form data:', {
      hasAudioFile: !!audioFile,
      audioFileType: audioFile?.type,
      hasSessionId: !!sessionId,
    })

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid audio file format',
        },
        { status: 400 }
      )
    }

    const transcriptionFile = new File([audioFile], 'audio.webm', {
      type: 'audio/webm',
    })

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'No session ID provided',
        },
        { status: 400 }
      )
    }

    const file = new File([audioFile], 'audio.webm', {
      type: audioFile.type || 'audio/webm',
    })

    console.log('Starting transcription...')
    const transcription = await openai.audio.transcriptions.create({
      file: transcriptionFile,
      model: 'whisper-1',
    })
    console.log('Transcription received:', transcription.text)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: transcription.text },
      ],
      temperature: 0.7,
      max_tokens: 100,
    })

    const aiResponse = completion.choices[0]?.message?.content
    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    const [chatMessage, speechRecord] = await Promise.all([
      prisma.chatMessage.create({
        data: {
          sessionId,
          userInput: transcription.text,
          aiResponse,
        },
      }),
      prisma.speechRecord.create({
        data: {
          userInput: transcription.text,
          aiResponse,
          duration: audioFile.size / 16000,
          language: 'en',
          topics: ['english-learning'],
          correctedText: aiResponse,
          confidence: 0.8,
          learningPoints: ['pronunciation', 'vocabulary'],
          pronunciation: 'good',
          audioUrl: '',
          isInappropriate: false,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        transcription: transcription.text,
        response: aiResponse,
        apiKey: ELEVEN_LABS_API_KEY,
        messageId: chatMessage.id,
        recordId: speechRecord.id,
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process speech',
      },
      { status: 500 }
    )
  }
}
