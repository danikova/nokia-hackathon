# Stage 1: Build the go backend
FROM golang:1.22 AS backend-builder
WORKDIR /app/backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -o backendBin .


# Stage 2: Build the js frontend
# FROM node:18 AS frontend-builder
# WORKDIR /app/frontend
# COPY frontend/package*.json ./
# RUN npm install
# COPY frontend/ ./
# RUN npm run build


# Stage 3: Create the final image
FROM nginx:stable-alpine3.17-slim
WORKDIR /app/

COPY --from=backend-builder /app/backend/backendBin /app/api
# COPY --from=frontend-builder /app/frontend/build/ /usr/share/nginx/html
COPY deploy/root /

RUN apk add certbot certbot-nginx
RUN crontab -l | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | crontab -

EXPOSE 80 433
# CMD ["/bin/sh", "/app/start.sh"]
