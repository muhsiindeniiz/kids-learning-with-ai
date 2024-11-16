import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { OpenAI } from "openai";

const prisma = new PrismaClient();

// Environment variables'ları kontrol fonksiyonu
const getConfig = () => {
  const config = {
    openaiApiKey: process.env.OPENAI_API_KEY,
    elevenLabsApiKey: process.env.ELEVEN_LABS_API_KEY,
    isProduction: process.env.NODE_ENV === "production",
  };

  console.log("Environment Check:", {
    hasOpenAI: !!config.openaiApiKey,
    hasElevenLabs: !!config.elevenLabsApiKey,
    environment: process.env.NODE_ENV,
  });

  return config;
};

export async function POST(request) {
  const config = getConfig();

  // API anahtarlarını kontrol et
  if (!config.openaiApiKey || !config.elevenLabsApiKey) {
    console.error("Missing API keys:", {
      openai: !config.openaiApiKey,
      elevenLabs: !config.elevenLabsApiKey,
    });

    return NextResponse.json(
      {
        success: false,
        error: "API configuration error",
        details: config.isProduction
          ? undefined
          : {
              missingKeys: {
                openai: !config.openaiApiKey,
                elevenLabs: !config.elevenLabsApiKey,
              },
            },
      },
      { status: 500 }
    );
  }

  // OpenAI istemcisini oluştur
  const openai = new OpenAI({
    apiKey: config.openaiApiKey,
  });

  try {
    // Form verilerini al
    const formData = await request.formData();
    const audioFile = formData.get("audio");
    const sessionId = formData.get("sessionId");

    console.log("Request data:", {
      hasAudio: !!audioFile,
      audioType: audioFile?.type,
      hasSessionId: !!sessionId,
    });

    // Giriş verilerini kontrol et
    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid audio file",
        },
        { status: 400 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "Session ID required",
        },
        { status: 400 }
      );
    }

    // Audio dosyasını hazırla
    const audioBuffer = await audioFile.arrayBuffer();
    const transcriptionFile = new File([audioBuffer], "audio.webm", {
      type: "audio/webm",
    });

    // Transcription işlemi
    console.log("Starting transcription...");
    const transcription = await openai.audio.transcriptions.create({
      file: transcriptionFile,
      model: "whisper-1",
    });
    console.log("Transcription result:", transcription.text);

    // AI yanıtı al
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI assistant that helps children learn English.",
        },
        {
          role: "user",
          content: transcription.text,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    // Veritabanı kayıtları
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
        apiKey: config.elevenLabsApiKey,
        messageId: chatMessage.id,
        recordId: speechRecord.id,
      },
    });
  } catch (error) {
    console.error("Processing error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Processing failed",
        details: config.isProduction
          ? undefined
          : {
              message: error.message,
              stack: error.stack,
            },
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
