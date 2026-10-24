# corp

[doany.io](https://doany.io) — 屋号 Doa の事業者サイト。Astro で書き出した静的なページを、小さな Bun のサーバー (`server.ts`) が配信する。
見た目は [Blades](https://blades.dev/) (Pico CSS の後継) の部品だけを読み、その上に denpa の [見た目の決まり](https://github.com/danything/denpa/blob/main/docs/design.md) (塗らない・層で浮かせる・動きは CSS だけ) をそのまま当てている。
ページの移り変わりは cross-document view transitions、巻いて出る件とヘッダーの浮き方は scroll-driven animations で、JS は使わない。動きを減らす設定では全部止める。

日本語は `/`、英語は `/en/` 以下 (ブログと同じ作り)。

ブログは [b.doany.io](https://b.doany.io) ([danything/blog](https://github.com/danything/blog)) に移った。

## 構成

|                                    |                                                                                                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/[...lang]/`             | ページ (`/`・`/business/`・`/works/`・`/company/` (代表のプロフィールは `#profile`)・`/privacy/`・`/contact/`・`/contact/thanks/`)。`getStaticPaths` で日本語と英語を作る |
| `src/i18n/languages/`              | 文言 (`ja.ts`・`en.ts`)。英語版は日本語版と同じ形にする                                                                                                                   |
| `src/config.ts`                    | 事業者の情報とリンク (サービス・実績・OSS・SNS)                                                                                                                           |
| `src/components/ContactForm.astro` | 問い合わせフォーム。Turnstile のスクリプトは `/contact/` でだけ読む                                                                                                       |
| `src/styles/main.css`              | 全ページの土台 (`Layout.astro` が読む)。全ページで使う Blades の部品・トークン (`--doa-*`)・地と字・ボタン・動き。ほかの見た目は各 `.astro` の `<style>`                  |
| `server.ts`                        | 配信サーバー。`server/` に中身 (`static.ts`・`contact.ts`・`contact-page.ts`・`markdown.ts`・`rate-limit.ts`)                                                             |
| `tests/`                           | サーバーのテスト (`bun test`)                                                                                                                                             |
| `deploy/`                          | k8s のマニフェスト。Argo CD が同期する (`deploy/argocd.yaml`)                                                                                                             |

## サーバー

`dist/` のファイルを返すほかに、次のことだけをする。

- **旧ブログの URL の転送。** GET・HEAD で `dist/` に無いパスは、`https://b.doany.io` の同じパス (とクエリ) へ 301 で送る
  (`/posts/renewal/` → `https://b.doany.io/posts/renewal/`)。ページのパスに `/` が無ければ `/` 付きへ 301 (`/contact` → `/contact/`)。
  判定は起動時に読んだ `dist/` のファイルの一覧だけで決める。`/.well-known/matrix/*` は Gateway で Matrix へ向けているので来ない。
  **事業者サイトに足すページの名前は、ブログのパス (`/about/`・`/archive/`・`/posts/` など) とぶつけないこと** (ぶつけると旧ブログの URL が転送されなくなる)
- **`POST /api/contact`** — 問い合わせ。JSON かフォームの送信 (`application/x-www-form-urlencoded`) を受け、
  入力を確かめ (名前・メール・本文は必須、会社は任意)、見えない項目 (`website`) に値があればボットとみなして送ったふりをし、
  IP ごとに 1 時間 5 回まで (`CF-Connecting-IP`、無ければ `X-Forwarded-For`)、Turnstile のトークンを Cloudflare に確かめてから、
  `CONTACT_WEBHOOK_URL` (matrix-hookshot の汎用 webhook) に `{"text": "<Markdown>"}` を送る。
  入力は Markdown として解釈されないよう、すべてコード (インラインコードとコードブロック) に入れ、`@` の後ろに幅の無い空白を挟む
  (`@room` で部屋全員に通知させない)。入力の中身はログに出さない。
  JavaScript があればページが fetch で送り、無ければ普通のフォームの送信になる (成功は完了のページへ 303、失敗はフォームに入力とエラーを書き戻して返す)
- **`GET /healthz`** — 200 を返す (k8s のプローブ)

`_astro/` は長期キャッシュ、HTML などは都度検証。ビルドで書き出した `.br` があり、ブラウザが受け付ければそちらを返す。

### 環境変数

| 名前                  |                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------ |
| `CONTACT_WEBHOOK_URL` | 問い合わせを送る hookshot の汎用 webhook の URL                                      |
| `TURNSTILE_SECRET`    | Cloudflare Turnstile の「doany.io」ウィジェット (yosegaki と同じ) のシークレットキー |
| `PORT`                | 待ち受けるポート (既定 8080)                                                         |
| `DIST_DIR`            | 配信するディレクトリ (既定 `./dist`)                                                 |

どちらかの秘密が無ければ、問い合わせは 503 を返す (ページの配信はできる)。
ビルド時の `PUBLIC_TURNSTILE_SITE_KEY` でサイトキーを差し替えられる (無ければ本番のキー)。

## 開発

```shell
bun install
bun run dev        # http://localhost:4321 (Astro の開発サーバー。/api/contact と転送は無い)
```

サーバーごと試すときはビルドしてから起動する。Turnstile は Cloudflare のテスト用のキー (常に通る) を使う。

```shell
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA bun run build
TURNSTILE_SECRET=1x0000000000000000000000000000000AA CONTACT_WEBHOOK_URL=https://... bun run start
```

http://localhost:8080

```shell
bun run lint       # oxlint・整形の確かめ (bun fmt --check)・型チェック (astro check)
bun run format     # oxlint で直せるものを直し、bun fmt で整形する
bun test           # サーバーのテスト
bun run build      # dist/ (サイトと .br) と build/server.js
```

Docker で動かす場合:

```shell
docker build -t corp --build-arg PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA .
docker run --rm -p 8080:8080 -e TURNSTILE_SECRET=1x0000000000000000000000000000000AA -e CONTACT_WEBHOOK_URL=https://... corp
```

## デプロイ

main に push すると GitHub Actions (`.github/workflows/docker.yml`) がイメージを ghcr.io に公開し、
`deploy/deployment.yaml` のタグを書き換えて push する。Argo CD (danything/gitops の ApplicationSet) が `deploy/` を namespace `corp` に同期する。

- `deploy/httproute.yaml` — Cilium Gateway `doany` の `https-apex` リスナー、`doany.io`
- `deploy/secret.yaml` — `InfisicalSecret`。Infisical の `/corp/corp-secrets` (`contact-webhook-url`・`turnstile-secret`) を Secret `corp-secrets` にする

イメージは distroless の Bun に `server.js` (`server.ts` を 1 ファイルにまとめたもの) と `dist/` だけを置き、uid 65532 で、ルートを読み取り専用にして動かす。
