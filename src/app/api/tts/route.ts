import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Limit text length for safety
    const safeText = text.substring(0, 500);

    const zai = await ZAI.create();

    const result = await zai.tts.create({
      text: safeText,
      voice: 'alloy',
    });

    // The result contains audio data - return it as a streaming response
    if (result && result.audio) {
      const audioBuffer = Buffer.from(result.audio, 'base64');
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBuffer.length.toString(),
        },
      });
    }

    return NextResponse.json({ error: 'No audio generated' }, { status: 500 });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}
