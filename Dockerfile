# syntax=docker/dockerfile:1@sha256:572cebbc2b15e6f84c077742952674889cb63cd5e9b80abdffcbe587b6f19183
FROM oven/bun:1.4.5-slim@sha256:b780593f3e10918cbdaec3d5a08d52224b9198069a65eb47812085c2ec007643 AS base

FROM base AS builder
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
FROM oven/bun:1.4.5-distroless@sha256:3a210956422ad81cf7532e1fc1f2eb9275d6ef4c2337a9d25d530f798e80726a
WORKDIR /app
COPY --from=builder /usr/src/app/build/server.js ./server.js
COPY --from=builder /usr/src/app/dist ./dist
ENV NODE_ENV=production PORT=8080 DIST_DIR=/app/dist
USER 65532:65532
EXPOSE 8080
# 死活の確認は k8s のプローブ (deploy/deployment.yaml の /healthz) でする
ENTRYPOINT ["/usr/local/bin/bun"]
CMD ["server.js"]
