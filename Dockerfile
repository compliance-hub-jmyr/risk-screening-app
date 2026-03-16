# =========================================
# Stage 1: Build the Angular Application
# =========================================
ARG NODE_VERSION=22-alpine
ARG NGINX_VERSION=alpine

FROM node:${NODE_VERSION} AS builder

WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy source and build
COPY . .
RUN npm run build

# =========================================
# Stage 2: Serve with Nginx (non-root)
# =========================================
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

USER nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx --from=builder /app/dist/*/browser /usr/share/nginx/html

EXPOSE 8080

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]
