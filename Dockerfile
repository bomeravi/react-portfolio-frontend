# syntax=docker/dockerfile:1.6

# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Use BuildKit cache for npm + reduce extra network calls
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# Copy the rest of the application code
COPY . .

# Build the application
ARG MODE=production
ENV NODE_ENV=production
RUN npm run build -- --mode $MODE

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
