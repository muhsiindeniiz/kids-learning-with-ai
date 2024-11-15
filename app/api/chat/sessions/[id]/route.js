import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const sessionId = await params.id

    const messages = await prisma.chatMessage.findMany({
      where: {
        sessionId: sessionId,
      },
      orderBy: {
        timestamp: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      messages: messages || [],
    })
  } catch (error) {
    console.error('Error fetching session messages:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch session messages',
        messages: [],
      },
      { status: 500 }
    )
  }
}
