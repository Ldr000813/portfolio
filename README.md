# ポートフォリオ（李徳潤 ｜ Web制作 & 業務効率化）

Next.js（App Router）＋ TypeScript。文言・画像は `/admin`（管理画面）から編集でき、内容は Vercel Blob に保存されます（DB不要）。

## 開発

```bash
npm install
npm run dev     # http://localhost:3000
```

## 管理画面（/admin）

- URL：`/admin`
- ログイン：環境変数 **`ADMIN_PASSWORD`** のパスワード。
- できること：ヒーローのキャッチコピー、サービス、制作実績（画像アップロード対応）、選ばれる理由、流れ、料金、問い合わせ先など、サイトの文言と画像をすべて編集・保存。保存すると公開ページに反映されます。

## 環境変数（Vercel → Settings → Environment Variables）

| 変数 | 用途 |
|---|---|
| `ADMIN_PASSWORD` | 管理ログインのパスワード |
| `BLOB_READ_WRITE_TOKEN` | 文言JSON・画像の保存用。Vercelで **公開（public）** のBlobストアを作成し接続すると自動で追加されます |

## 公開（Vercel）

GitHubに上げて Vercel にインポート → Framework Preset = **Next.js** → 上記の環境変数を設定 → デプロイ。
※ 公開サイトなので、Vercel の **Deployment Protection（Vercel Authentication）は Disabled** に（ログイン画面を出さないため）。

## メモ

- 初期表示の文言は `src/lib/content.ts` の `DEFAULT`。まだ一度も保存していない間はこれが表示されます。
- 画像を使うには公開Blobストアが必要です（未接続なら画像なしのグラデーション表示になります）。
