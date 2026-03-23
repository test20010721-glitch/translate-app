export async function POST(req: Request) {
    const { image } = await req.json();
  
    const apiKey = process.env.GOOGLE_VISION_API_KEY;
  
    const res = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: image.split(',')[1],
              },
              features: [{ type: 'TEXT_DETECTION' }],
            },
          ],
        }),
      }
    );
  
    const data = await res.json();
  
    const text =
      data.responses?.[0]?.fullTextAnnotation?.text || '';
  
    return Response.json({ text });
  }