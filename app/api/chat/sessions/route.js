import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    await prisma.$connect()

    console.log('Fetching sessions...')
    const sessions = await prisma.chatSession.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        messages: true,
      },
    })
    console.log('Sessions fetched:', sessions)

    return NextResponse.json({
      success: true,
      sessions: sessions || [],
    })
  } catch (error) {
    console.error('Detailed error in sessions route:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    })

    if (error.code) {
      console.error('Prisma error code:', error.code)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch sessions',
        details: error.message,
        sessions: [],
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
