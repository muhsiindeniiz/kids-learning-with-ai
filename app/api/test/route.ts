import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        success: true,
        environment: process.env.NODE_ENV,
        hasOpenAI: !!process.env.OPENAI_API_KEY,
        hasElevenLabs: !!process.env.ELEVEN_LABS_API_KEY,
        hasMongoDb: !!process.env.MONGO_DB_URL
    });
}