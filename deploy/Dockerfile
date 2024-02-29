# Stage 1: Build the go backend
FROM golang:1.22 AS backend-builder
WORKDIR /app/backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -o backendBin .

FROM alpine:latest AS backend
WORKDIR /app/backend
COPY deploy/files/backend/ /
COPY backend/migrations/ ./migrations/
COPY --from=backend-builder /app/backend/backendBin .
CMD ["sh", "./start.sh"]

# Stage 2: Build the js frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 3: Create the proxy image
FROM nginx:mainline-alpine3.18-perl AS proxy
WORKDIR /app/proxy
COPY deploy/files/proxy /
COPY --from=frontend-builder /app/frontend/dist/ ./frontend/
CMD ["sh", "./start.sh"]

# Stage 4: Create the certbot image
FROM certbot/certbot:latest AS certbot
WORKDIR /app/certbot
