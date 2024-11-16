import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { OpenAI } from "openai";
import env from "@/env";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: env.openaiApiKey,
});

// API anahtarını doğrudan process.env'den al
const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;

export async function POST(request) {
  // API anahtarını kontrol et ve log'la
  console.log("API Key check:", {
    hasElevenLabsKey: !!ELEVEN_LABS_API_KEY,
    envCheck: !!env.elevenLabsApiKey,
    deployEnv: env.deployEnv,
  });

  if (!ELEVEN_LABS_API_KEY) {
    console.error("ElevenLabs API key is missing");
    return NextResponse.json(
      {
        success: false,
        error: "ElevenLabs API key not configured",
        env: env.deployEnv, // Debug için environment bilgisini ekleyin
      },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio");
    const sessionId = formData.get("sessionId");

    // İşlem detaylarını logla
    console.log("Processing request:", {
      hasAudioFile: !!audioFile,
      audioType: audioFile?.type,
      sessionId: sessionId,
      environment: env.deployEnv,
    });

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { success: false, error: "Invalid audio file format" },
        { status: 400 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "No session ID provided" },
        { status: 400 }
      );
    }

    const transcriptionFile = new File([audioFile], "audio.webm", {
      type: "audio/webm",
    });

    // Transcription işlemi
    console.log("Starting transcription...");
    const transcription = await openai.audio.transcriptions.create({
      file: transcriptionFile,
      model: "whisper-1",
    });
    console.log("Transcription completed:", transcription.text);

    // AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: transcription.text },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    // Database kayıtları
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
          language: "en",
          topics: ["english-learning"],
          correctedText: aiResponse,
          confidence: 0.8,
          learningPoints: ["pronunciation", "vocabulary"],
          pronunciation: "good",
          audioUrl: "",
          isInappropriate: false,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        transcription: transcription.text,
        response: aiResponse,
        apiKey: ELEVEN_LABS_API_KEY,
        messageId: chatMessage.id,
        recordId: speechRecord.id,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to process speech",
        debug: env.deployEnv === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
