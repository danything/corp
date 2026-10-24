# syntax=docker/dockerfile:1@sha256:4edf897a3ffa55b89f906fc8cc78afdb3f1834cc9c7083565e611a8a7d5fe99e
FROM oven/bun:1.4.4-slim@sha256:1846adf22496bd711036aae8be147e57bdebbaea2e5264e3e0b5af1db187d9a4 AS builder
WORKDIR /usr/src/app

COPY package.json bun.lock ./
RUN bun i --frozen-lockfile

COPY . .
# 手元で試すときは --build-arg PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA (Cloudflare のテスト用。常に通る)。
# 空なら本番の「doany.io」ウィジェットのキー (src/config.ts)
ARG PUBLIC_TURNSTILE_SITE_KEY
# dist/ (サイトと配信用の .br) と build/server.js (server.ts を 1 ファイルにまとめたもの) を作る
RUN bun run build

# 配信用はシェルもパッケージマネージャも無い distroless の Bun に、server.js と dist/ だけを置く。
# 実行時の依存は無い (server.ts は Bun の組み込みだけを使う)。uid 65532 (distroless の nonroot) で動かし、
# ファイルは root のもののまま (読むだけ)。書き込む場所は要らないので、k8s ではルートを読み取り専用にする
FROM oven/bun:1.4.4-distroless@sha256:153a951ae40106e125898103e6e990ee0f38e6aee7f561029e26cf9fbed23470
WORKDIR /app
COPY --from=builder /usr/src/app/build/server.js ./server.js
COPY --from=builder /usr/src/app/dist ./dist
ENV NODE_ENV=production PORT=8080 DIST_DIR=/app/dist
USER 65532:65532
EXPOSE 8080
# 死活の確認は k8s のプローブ (deploy/deployment.yaml の /healthz) でする
ENTRYPOINT ["/usr/local/bin/bun"]
CMD ["server.js"]
