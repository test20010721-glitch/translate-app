import { NextRequest, NextResponse } from 'next/server';

  const TONE_INSTRUCTIONS = {
    casual: 'フレンドリーで親しみやすい表現を使ってください。自然でリアルな会話表現にしてください。',
    business: 'ビジネスシーンに適したフォーマルな表現を使ってください。',
    polite: '丁寧で礼儀正しい表現を使ってください。',
    email: 'ビジネスメールとして適切な文章に整えてください。挨拶や締めも含めて自然な文章にしてください。',
    menu: `料理名を翻訳し、その料理の内容を説明してください。

条件:
・翻訳語 + 簡単な説明をセットで出力
・食材が分かる場合は具体的に書く
・不明な場合は「一般的には〜」と補足
・どんな料理かをイメージできるような説明をしてくだい

出力例:
Sushi：酢飯と生魚を使った日本料理
Omurice：一般的にはケチャップライスを卵で包んだ料理`
  };

const LANGUAGE_NAMES: Record<string, string> = {
  ja: '日本語',
  en: '英語',
  es: 'スペイン語',        // ←追加
  ca: 'カタルーニャ語',   // ←追加
};

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLang, targetLang, tone } = await request.json();

    if (!text || !sourceLang || !targetLang || !tone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file.' },
        { status: 500 }
      );
    }

    const toneInstruction = TONE_INSTRUCTIONS[tone as keyof typeof TONE_INSTRUCTIONS] || TONE_INSTRUCTIONS.casual;
    const sourceLanguage = LANGUAGE_NAMES[sourceLang] || sourceLang;
    const targetLanguage = LANGUAGE_NAMES[targetLang] || targetLang;

    const prompt = `以下の${sourceLanguage}の文章を${targetLanguage}に翻訳してください。

翻訳の条件:
1. 直訳は禁止です
2. ニュアンス、感情、スラング感を保ったまま翻訳してください
3. ネイティブが日常で使う自然な言い回しに変換してください
4. ${toneInstruction}

翻訳する文章:
${text}

翻訳結果のみを出力してください。説明や注釈は不要です。`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'あなたは優秀な翻訳者です。文脈、ニュアンス、感情を理解し、自然な翻訳を提供します。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Translation failed', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    const translatedText = data.choices[0]?.message?.content?.trim() || '';

    return NextResponse.json({
      translatedText,
      success: true,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
