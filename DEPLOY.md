# 诗词鉴赏网站 - 部署配置

## 方式一：Vercel（前端）+ Railway（后端）— 推荐

### 前端 → Vercel

1. 将项目推送到 GitHub
2. 在 [vercel.com](https://vercel.com) 导入仓库
3. 配置：
   - **Framework**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: 无（前端通过相对路径 `/api` 访问后端，需配置 vercel.json 代理）
4. 部署完成后获得域名如 `poetry-app.vercel.app`

### 后端 → Railway

1. 在 [railway.app](https://railway.app) 导入 GitHub 仓库
2. 配置：
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Environment Variables**:
     - `PORT`: `3000`
     - `POETRY_API_URL`: `https://你的诗泉API地址` （或部署自己的诗泉实例）
3. 部署完成后获得域名如 `poetry-api.up.railway.app`
4. 回到 Vercel，添加环境变量 `VITE_API_URL` 指向 Railway 域名

---

## 方式二：Docker Compose 一键部署

```bash
# 1. 在项目根目录执行
docker compose up -d

# 2. 访问 http://localhost:80
```

---

## 方式三：本地开发

```bash
# 后端
cd server && pnpm install && pnpm start:dev

# 前端（新终端）
cd client && npm install && npm run dev
# 访问 http://localhost:5173
```
