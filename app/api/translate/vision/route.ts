import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    const base64 = image.replace(/^data:image\/\w+;base64,/, '');

    const res = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        body: JSON.stringify({
          requests: [
            {
              image: { content: base64 },
              features: [{ type: 'TEXT_DETECTION' }],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    const text =
      data.responses?.[0]?.fullTextAnnotation?.text || '';

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: 'OCR失敗' }, { status: 500 });
  }
}