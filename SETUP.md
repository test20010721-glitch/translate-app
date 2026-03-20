# セットアップガイド

このドキュメントでは、AI翻訳アプリをゼロから起動するまでの手順を説明します。

## 前提条件

- Node.js 18以降がインストールされていること
- ターミナル/コマンドプロンプトの基本的な使い方を理解していること

## Step 1: OpenAI APIキーの取得

1. **OpenAI アカウントの作成**
   - [https://platform.openai.com/](https://platform.openai.com/) にアクセス
   - 「Sign up」をクリックしてアカウントを作成
   - メールアドレスで認証を完了

2. **APIキーの作成**
   - ログイン後、右上のアカウントメニューをクリック
   - 「View API keys」を選択
   - 「Create new secret key」をクリック
   - キーが表示されたら、**必ずコピーして安全な場所に保存**（再表示できません）

3. **クレジット/支払い情報の設定**
   - OpenAI APIは従量課金制です
   - 「Billing」セクションで支払い方法を設定
   - 初回は無料クレジットが付与される場合があります

## Step 2: 環境変数の設定

1. プロジェクトのルートディレクトリにある `.env` ファイルを開く

2. `OPENAI_API_KEY` の値を、Step 1で取得したAPIキーに置き換える：

```env
NEXT_PUBLIC_SUPABASE_URL=https://hkqssnszfzpcsynjualf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. ファイルを保存

## Step 3: 依存パッケージのインストール

ターミナルを開き、プロジェクトのルートディレクトリで以下のコマンドを実行：

```bash
npm install
```

これにより、必要なすべてのパッケージがインストールされます（数分かかる場合があります）。

## Step 4: アプリケーションの起動

```bash
npm run dev
```

次のようなメッセージが表示されます：

```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## Step 5: アプリケーションの確認

1. ブラウザを開く
2. `http://localhost:3000` にアクセス
3. AI翻訳アプリが表示されることを確認

## 動作確認

### 基本的な翻訳テスト

1. **日本語 → 英語の翻訳**
   - 言語設定: 日本語 → English
   - 翻訳スタイル: カジュアル
   - テキスト入力: "めっちゃいい感じじゃん！"
   - 「翻訳する」をクリック
   - 結果例: "That's totally awesome!"

2. **トーンの違いを確認**
   - 同じテキストで翻訳スタイルを変更
   - ビジネス: "非常に良好な状態です" → "It looks very favorable"
   - カジュアル: "非常に良好な状態です" → "Things are looking pretty good"

3. **履歴機能の確認**
   - 複数回翻訳を実行
   - 右サイドバーに履歴が表示されることを確認
   - 履歴をクリックして、過去の翻訳が再表示されることを確認

## トラブルシューティング

### エラー: "OpenAI API key is not configured"

**原因**: APIキーが正しく設定されていない

**解決方法**:
1. `.env` ファイルを開く
2. `OPENAI_API_KEY` の値が `your_openai_api_key_here` のままになっていないか確認
3. 正しいAPIキーに置き換える（`sk-`で始まる文字列）
4. 開発サーバーを再起動: `Ctrl+C` → `npm run dev`

### エラー: "Translation failed" または 401 Unauthorized

**原因**: APIキーが無効、または支払い情報が未設定

**解決方法**:
1. [OpenAI Platform](https://platform.openai.com/) にログイン
2. APIキーが有効か確認
3. Billingセクションで支払い方法が設定されているか確認
4. クレジットまたは残高があるか確認

### エラー: "Cannot find module..."

**原因**: パッケージのインストールが不完全

**解決方法**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### 翻訳履歴が表示されない

**原因**: Supabaseへの接続問題

**解決方法**:
1. ブラウザの開発者ツール（F12）を開く
2. Consoleタブでエラーメッセージを確認
3. エラーがある場合は、エラーメッセージをコピーして調査

### ポートが既に使用されている

**原因**: 別のアプリケーションがポート3000を使用中

**解決方法**:
```bash
# 別のポートで起動
npm run dev -- -p 3001
```

その後、`http://localhost:3001` にアクセス

## 次のステップ

### 本番環境へのデプロイ

アプリケーションが正常に動作することを確認したら、以下のプラットフォームにデプロイできます：

1. **Netlify** (推奨)
   - GitHubにコードをプッシュ
   - Netlifyでリポジトリを接続
   - 環境変数を設定
   - 自動デプロイ

2. **Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **その他のプラットフォーム**
   - Railway
   - Render
   - AWS Amplify

詳細は `README.md` を参照してください。

### カスタマイズ

- **新しい言語の追加**: `app/page.tsx` の `LANGUAGES` 配列を編集
- **翻訳プロンプトの調整**: `app/api/translate/route.ts` の `TONE_INSTRUCTIONS` を編集
- **デザインの変更**: Tailwind CSSクラスを調整

## サポート

問題が解決しない場合は、以下の情報を含めてGitHub Issuesで報告してください：

1. エラーメッセージの全文
2. 実行した手順
3. 使用しているOS（Windows, Mac, Linux）
4. Node.jsのバージョン（`node --version`）

---

以上でセットアップは完了です。翻訳を楽しんでください！
