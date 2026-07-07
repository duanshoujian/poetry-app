# 后端 Dockerfile - 多阶段构建
# Railway Docker 构建上下文为仓库根目录，COPY 路径需加 server/ 前缀
FROM node:22-alpine AS builder
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
ENV PORT=3000
CMD ["node", "dist/main"]
