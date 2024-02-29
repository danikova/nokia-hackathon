# Stage 1: Build the go backend
FROM golang:1.22 AS backend-builder
WORKDIR /app/backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -o backend .

# Stage 2: Build the js frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 3: Build the final image
FROM alpine:latest
WORKDIR /app/
COPY ./start.sh .
COPY backend/migrations/ ./migrations/
COPY --from=backend-builder /app/backend/backend .
COPY --from=frontend-builder /app/frontend/dist ./frontend/

EXPOSE 8080

CMD ["sh", "./start.sh"]
