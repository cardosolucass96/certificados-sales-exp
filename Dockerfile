# Multi-stage build for Next.js app
FROM node:18-alpine AS builder
WORKDIR /app
# install deps
COPY package*.json ./
RUN npm ci
# copy sources and build
COPY . .
RUN npm run build

# production image
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
# copy from builder
COPY --from=builder /app/ .
# install only prod deps to keep image small
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["npm", "start"]
