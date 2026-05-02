# 🚀 Realtime Task App

> **みんなで使える、リアルタイム同期型タスク管理アプリ。**
> Supabase の Realtime 機能を活用し、誰かがタスクを追加・更新するとリロードなしで全員の画面に即時反映されます。

<p align="left">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white">
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green">
</p>

---

## 🌐 Live Demo

🔗 **[https://my-task-app-xxxx.vercel.app](https://my-task-app-xxxx.vercel.app)**

> ※ 上記 URL はダミーです。実際のデプロイ後、自分のものに差し替えてください。

---

## ✨ 主な機能

| カテゴリ | 機能 | 説明 |
| :--- | :--- | :--- |
| 👤 **アカウント** | ユーザー名（プロフィール）の登録 | サインアップ後に表示用のユーザー名を設定できます |
| ✅ **タスク管理** | タスクの追加 / 編集 / 削除 | シンプルな UI で素早くタスクを管理できます |
| ⚡ **リアルタイム同期** | 他ユーザーの更新が即時反映 | Supabase Realtime により、リロード不要で全員の画面に反映 |
| 🗂️ **タスクの分離表示** | 「自分のタスク」と「みんなのタスク」 | 自分のタスクと他のメンバーのタスクをタブで切り替えて表示 |
| 🔐 **認証** | メール / パスワード認証 | Supabase Auth による安全なログイン |

---

## 🛠️ 使用技術（Tech Stack）

### Frontend

| 技術 | 用途 |
| :--- | :--- |
| **React 19** | UI ライブラリ |
| **TypeScript** | 型安全な開発 |
| **Vite** | 高速な開発サーバー & ビルドツール |
| **Tailwind CSS** | ユーティリティファーストの CSS フレームワーク |
| **lucide-react** | モダンな SVG アイコン |

### Backend / Infrastructure

| 技術 | 用途 |
| :--- | :--- |
| **Supabase Auth** | メール/パスワード認証 |
| **Supabase Database** | PostgreSQL ベースのデータ保存 |
| **Supabase Realtime** | データ変更のリアルタイム配信 |
| **Supabase RLS** | Row Level Security による行単位のアクセス制御 |
| **Vercel** | ホスティング & 自動デプロイ |

---

## 🏗️ アーキテクチャ概要

```
┌──────────────┐        Realtime        ┌──────────────┐
│              │ ◀─────────────────────▶│              │
│ React (Vite) │       (WebSocket)       │   Supabase   │
│  + Tailwind  │                         │  ┌────────┐  │
│              │ ── Auth / CRUD ──────▶ │  │  Auth  │  │
│              │                         │  ├────────┤  │
│              │                         │  │  DB    │  │
│              │                         │  │ + RLS  │  │
└──────────────┘                         │  └────────┘  │
                                          └──────────────┘
```

- フロントから Supabase に対して CRUD 操作を実行
- Supabase 側で **RLS（Row Level Security）** によりユーザー単位のアクセス制御
- データ変更は **Realtime（WebSocket）** で全クライアントに自動配信

---

## 🚀 セットアップ手順

### 1. リポジトリをクローン

```bash
git clone https://github.com/riu-414/my-task-app.git
cd my-task-app
```

### 2. 依存パッケージをインストール

```bash
npm install
```

### 3. 環境変数を設定

プロジェクト直下に `.env.local` を作成し、Supabase の URL と anon key を設定します。

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> 🔑 これらの値は [Supabase ダッシュボード](https://app.supabase.com/) の `Project Settings → API` から取得できます。

### 4. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで [http://localhost:5173](http://localhost:5173) を開いてアクセスしてください。

---

## 📂 ディレクトリ構成

```
my-task-app/
├── .claude/
│   └── skills/              # Git運用ルール（自分用スキル）
│       ├── git-switch/
│       └── git-push/
├── src/
│   ├── App.tsx              # ルートコンポーネント
│   ├── supabaseClient.ts    # Supabase 初期化
│   ├── components/          # UI コンポーネント
│   ├── hooks/               # カスタムフック（Realtime購読など）
│   └── index.css            # Tailwind エントリポイント
├── .env.local               # 環境変数（Git管理外）
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 🗄️ Supabase 側のセットアップ

### テーブル例（`tasks`）

| カラム | 型 | 説明 |
| :--- | :--- | :--- |
| `id` | `uuid` | プライマリキー |
| `user_id` | `uuid` | 作成者の auth.users.id（外部キー） |
| `title` | `text` | タスク名 |
| `is_done` | `boolean` | 完了フラグ |
| `created_at` | `timestamptz` | 作成日時 |

### RLS ポリシー例

- **SELECT**: 全ユーザーが閲覧可能（みんなのタスク表示用）
- **INSERT / UPDATE / DELETE**: `auth.uid() = user_id` のときのみ許可

### Realtime の有効化

Supabase ダッシュボードで `Database → Replication` から `tasks` テーブルの Realtime をオンにします。

---

## 📜 利用可能なスクリプト

| コマンド | 説明 |
| :--- | :--- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | プロダクションビルドを作成 |
| `npm run preview` | ビルド結果をローカルでプレビュー |
| `npm run lint` | ESLint でコードチェック |

---

## 🌍 デプロイ（Vercel）

1. このリポジトリを Vercel にインポート
2. **Environment Variables** に `VITE_SUPABASE_URL` と `VITE_SUPABASE_ANON_KEY` を設定
3. デプロイを実行 → 自動で公開 URL が発行されます

> push するたびに Vercel が自動でビルド & デプロイしてくれます。

---

## 📄 License

[MIT](./LICENSE)

---

<p align="center">
  Built with ❤️ using <strong>React</strong> × <strong>Supabase</strong>
</p>
