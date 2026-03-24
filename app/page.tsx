'use client';

import { useState, useEffect } from 'react';
import { supabase, Translation } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeftRight, Copy, Loader as Loader2, Clock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

const LANGUAGES = [
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },   // スペイン語
  { code: 'ca', name: 'Català', flag: '🏴' },     // カタルーニャ語
];

const TONES = [
    { value: 'casual', label: 'カジュアル', description: 'リアルで自然な会話' },
    { value: 'business', label: 'ビジネス', description: '仕事で使う自然な表現' },
    { value: 'polite', label: '丁寧', description: '礼儀正しい表現' },
    { value: 'email', label: 'メール用', description: 'ビジネス用の文章作成' },
    { value: 'menu', label: 'メニュー', description: '料理の説明付き翻訳' },
  ];

export default function Home() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('ja');
  const [targetLang, setTargetLang] = useState('en');
  const [tone, setTone] = useState('casual');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Translation[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error('翻訳するテキストを入力してください');
      return;
    }

    setIsLoading(true);
    setTranslatedText('');

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sourceText,
          sourceLang,
          targetLang,
          tone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Translation failed');
      }

      setTranslatedText(data.translatedText);

      const { error: insertError } = await supabase
        .from('translations')
        .insert({
          source_lang: sourceLang,
          target_lang: targetLang,
          source_text: sourceText,
          translated_text: data.translatedText,
          tone,
        });

      if (insertError) {
        console.error('Error saving to history:', insertError);
      } else {
        loadHistory();
      }

      toast.success('翻訳が完了しました');
    } catch (error) {
      console.error('Translation error:', error);
      toast.error(
        error instanceof Error ? error.message : '翻訳に失敗しました'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleCopyTranslation = async () => {
    if (!translatedText) return;

    try {
      await navigator.clipboard.writeText(translatedText);
      toast.success('翻訳結果をコピーしました');
    } catch (error) {
      toast.error('コピーに失敗しました');
    }
  };

  const handleHistoryClick = (item: Translation) => {
    setSourceLang(item.source_lang);
    setTargetLang(item.target_lang);
    setSourceText(item.source_text);
    setTranslatedText(item.translated_text);
    setTone(item.tone);
  };

  const getToneLabel = (tone: string, lang: string) => {
    const labels: any = {
      ja: {
        casual: { title: 'カジュアル', desc: 'リアルで自然な会話' },
        business: { title: 'ビジネス', desc: '仕事で使う自然な表現' },
        polite: { title: '丁寧', desc: '礼儀正しい表現' },
        email: { title: 'メール用', desc: 'ビジネス用の文章作成' },
        menu: { title: 'メニュー', desc: '料理の説明付き' },
      },
      en: {
        casual: { title: 'Casual', desc: 'Relaxed tone' },
        business: { title: 'Business', desc: 'Professional tone' },
        polite: { title: 'Polite', desc: 'Respectful tone' },
        email: { title: 'Email', desc: 'Business email format' },
        menu: { title: 'Menu', desc: 'Food explanation' },
      },
      es: {
        casual: { title: 'Casual', desc: 'Tono relajado' },
        business: { title: 'Formal', desc: 'Lenguaje profesional' },
        polite: { title: 'Educado', desc: 'Tono respetuoso' },
        email: { title: 'Correo', desc: 'Formato de email' },
        menu: { title: 'Menú', desc: 'Explicación de comida' },
      },
      ca: {
        casual: { title: 'Casual', desc: 'To relaxat' },
        business: { title: 'Formal', desc: 'Llenguatge professional' },
        polite: { title: 'Educat', desc: 'To respectuós' },
        email: { title: 'Correu', desc: 'Format de correu' },
        menu: { title: 'Menú', desc: 'Explicació del plat' },
      },
    };
  
    return labels[lang]?.[tone] || { title: tone, desc: '' };
  };

  const getLanguageName = (code: string) => {
    return LANGUAGES.find((lang) => lang.code === code)?.name || code;
  };

  const getLanguageFlag = (code: string) => {
    return LANGUAGES.find((lang) => lang.code === code)?.flag || '';
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Toaster position="top-center" />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              AI翻訳
            </h1>
          </div>
          <p className="text-gray-600">
            ニュアンス・感情を保った自然な翻訳
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <Select value={sourceLang} onValueChange={setSourceLang}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSwapLanguages}
                    className="shrink-0"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </Button>

                  <Select value={targetLang} onValueChange={setTargetLang}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    翻訳スタイル
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {TONES.map((t) => {
  const main = getToneLabel(t.value, sourceLang);
  const sub = getToneLabel(t.value, targetLang);

  return (
    <Button
      key={t.value}
      variant={tone === t.value ? 'default' : 'outline'}
      size="sm"
      onClick={() => setTone(t.value)}
      className="flex flex-col h-auto py-2 items-start"
    >
      {/* メイン（左の言語） */}
      <span className="font-semibold">{main.title}</span>
      <span className="text-xs opacity-70">{main.desc}</span>

      {/* サブ（右の言語） */}
      {sourceLang !== targetLang && (
        <>
          <span className="font-semibold text-sm mt-1 text-gray-500">
            {sub.title}
          </span>
          <span className="text-xs text-gray-400">
            {sub.desc}
          </span>
        </>
      )}
    </Button>
  );
})}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <span>{getLanguageFlag(sourceLang)}</span>
                        <span>{getLanguageName(sourceLang)}</span>
                      </label>
                      <span className="text-xs text-gray-500">
                        {sourceText.length} / 5000
                      </span>
                    </div>
                    <Textarea
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                      placeholder="翻訳したいテキストを入力してください..."
                      className="min-h-[200px] resize-none text-base"
                      maxLength={5000}
                    />
                  </div>

                

{/* 翻訳ボタン */}
<Button
  onClick={handleTranslate}
  disabled={isLoading || !sourceText.trim()}
  className="w-full h-14 text-lg mt-2"
>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      翻訳中...
    </>
  ) : (
    <>
      {sourceLang === 'ja' ? '翻訳✏️' :
       sourceLang === 'es' ? 'Traducir✏️' :
       sourceLang === 'ca' ? 'Traduir✏️' :
       'Translate✏️'}
    </>
  )}
</Button>
                
                  {translatedText && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <span>{getLanguageFlag(targetLang)}</span>
                          <span>{getLanguageName(targetLang)}</span>
                        </label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyTranslation}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          コピー
                        </Button>
                      </div>
                      <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-green-50 min-h-[200px]">
                        <p className="text-base leading-relaxed whitespace-pre-wrap">
                          {translatedText}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold">翻訳履歴</h2>
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                      まだ翻訳履歴がありません
                    </p>
                  ) : (
                    history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleHistoryClick(item)}
                        className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1 text-xs text-gray-500">
                          <span>{getLanguageFlag(item.source_lang)}</span>
                          <ArrowLeftRight className="h-3 w-3" />
                          <span>{getLanguageFlag(item.target_lang)}</span>
                          <span className="ml-auto">
                            {new Date(item.created_at).toLocaleDateString(
                              'ja-JP',
                              {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </span>
                        </div>
                        <p className="text-sm line-clamp-2 text-gray-700">
                          {item.source_text}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {item.translated_text}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
