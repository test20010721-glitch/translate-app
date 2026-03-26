# AI翻訳アプリ

Google翻訳のようなUIを持つ、AI駆動の自然な翻訳アプリケーションです。ニュアンス・感情・スラングを保った翻訳を提供します。

## 特徴

- **自然な翻訳**: OpenAI GPT-4を使用して、直訳ではなく自然な表現で翻訳
- **トーン選択**: カジュアル、フレンドリー、ビジネス、丁寧の4つのスタイルから選択
- **翻訳履歴**: Supabaseを使った永続的な履歴保存
- **Google翻訳風UI**: 使いやすい2分割レイアウト
- **レスポンシブデザイン**: スマホ・タブレット・デスクトップ対応
- **コピー機能**: ワンクリックで翻訳結果をコピー
- **言語切り替え**: 簡単に翻訳方向を入れ替え

## 技術スタック

- **フロントエンド**: Next.js 13 (App Router), React, TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **バックエンド**: Next.js API Routes
- **AI**: OpenAI API (GPT-4)
- **データベース**: Supabase (PostgreSQL)

## 必要な環境

- Node.js 18以降
- OpenAI APIキー
- Supabase プロジェクト（既に設定済み）

## セットアップ手順

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルを開き、OpenAI APIキーを設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=https://hkqssnszfzpcsynjualf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

OPENAI_API_KEY=your_actual_openai_api_key_here
```

**OpenAI APIキーの取得方法:**

1. [OpenAI Platform](https://platform.openai.com/)にアクセス
2. アカウントを作成またはログイン
3. APIキーセクションで新しいキーを作成
4. 作成したキーを`.env`ファイルに貼り付け

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

## 使い方

### 基本的な翻訳

1. 上部の言語セレクターで翻訳元と翻訳先の言語を選択
2. 翻訳スタイル（カジュアル、フレンドリー、ビジネス、丁寧）を選択
3. テキストエリアに翻訳したいテキストを入力
4. 「翻訳する」ボタンをクリック
5. 翻訳結果が下部に表示されます

### その他の機能

- **言語の入れ替え**: 中央のアイコンボタンをクリックで翻訳方向を入れ替え
- **コピー**: 翻訳結果の「コピー」ボタンでクリップボードにコピー
- **履歴**: 右サイドバーから過去の翻訳をクリックして再表示

## データベース構造

### translations テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | uuid | 主キー |
| source_lang | text | 翻訳元言語コード (ja, en) |
| target_lang | text | 翻訳先言語コード (ja, en) |
| source_text | text | 翻訳元テキスト |
| translated_text | text | 翻訳結果 |
| tone | text | 翻訳スタイル |
| created_at | timestamptz | 作成日時 |

## ディレクトリ構成

```
.
├── app/
│   ├── api/
│   │   └── translate/
│   │       └── route.ts          # OpenAI翻訳APIエンドポイント
│   ├── globals.css               # グローバルスタイル
│   ├── layout.tsx                # ルートレイアウト
│   └── page.tsx                  # メインページ（翻訳UI）
├── components/
│   └── ui/                       # shadcn/uiコンポーネント
├── lib/
│   ├── supabase.ts              # Supabaseクライアント設定
│   └── utils.ts                  # ユーティリティ関数
├── .env                          # 環境変数
└── package.json
```

## デプロイ方法

### Netlifyへのデプロイ

このプロジェクトはNetlify用に設定されています：

1. GitHubにリポジトリをプッシュ
2. [Netlify](https://www.netlify.com/)でアカウント作成
3. 「New site from Git」を選択
4. リポジトリを選択
5. 環境変数を設定：
   - `OPENAI_API_KEY`: OpenAI APIキー
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase匿名キー
6. デプロイボタンをクリック

### Vercelへのデプロイ

```bash
npm install -g vercel
vercel
```

環境変数を設定：
```bash
vercel env add OPENAI_API_KEY
```

### その他のプラットフォーム

- **AWS Amplify**: GitHubリポジトリを接続
- **Railway**: ワンクリックデプロイ対応
- **Render**: 自動的にビルド・デプロイ

## トラブルシューティング

### 「OpenAI API key is not configured」エラー

`.env`ファイルの`OPENAI_API_KEY`が正しく設定されているか確認してください。

### 翻訳履歴が表示されない

Supabaseの接続を確認してください。ブラウザのコンソールでエラーメッセージを確認できます。

### ビルドエラー

```bash
rm -rf .next node_modules
npm install
npm run build
```

## ライセンス

MIT License

## 開発者向け情報

### 新しい言語の追加

`app/page.tsx`の`LANGUAGES`配列に新しい言語を追加：

```typescript
const LANGUAGES = [
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }, // 新しい言語
];
```

### 翻訳プロンプトのカスタマイズ

`app/api/translate/route.ts`の`TONE_INSTRUCTIONS`を編集して、トーンごとの指示をカスタマイズできます。

## サポート

問題や質問がある場合は、GitHubのIssuesで報告してください。

---

Made with ❤️ using Next.js, OpenAI, and Supabase
