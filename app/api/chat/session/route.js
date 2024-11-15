import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    await prisma.$connect()

    const session = await prisma.chatSession.create({
      data: {
        createdAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
    })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create session',
        details: error.message,
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
