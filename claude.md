# プロジェクト概要
React (Vite), TypeScript, Supabase を使用したリアルタイム共有タスク管理アプリ。

# 技術スタック
- Frontend: React, TypeScript, Tailwind CSS (Vite)
- Backend/DB: Supabase
- Icons: lucide-react

# 実装要件
1. Supabase Auth を使用したメールパスワード認証（ログイン/サインアップ）
2. タスクの一覧表示、追加、完了フラグの切り替え、削除
3. Supabase Realtime を使用した、全ユーザー間でのデータ即時同期
4. UIは Tailwind CSS を使い、クリーンでモダンなデザインにする

# AIへの指示
現在、Viteでのプロジェクト作成と `.env.local` の設定まで完了しています。
以下の順番で実装に必要なコードを生成し、どのファイルをどう書き換えればいいか教えてください。

1. `src/supabaseClient.ts` の作成（Supabaseの初期化）
2. `tailwind.config.js` と `src/index.css` の設定（Tailwindの有効化）
3. `src/App.tsx` などのUIコンポーネントの実装（認証とタスク管理）