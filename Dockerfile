# Multi-stage build for Next.js app
FROM node:18-alpine AS builder
WORKDIR /app
# install build dependencies for canvas
RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev pango-dev giflib-dev
# install dependencies
COPY package*.json ./
RUN npm ci
# copy sources and build
COPY . .
RUN npm run build

# production image
FROM node:18-alpine
WORKDIR /app
# install runtime dependencies for canvas
RUN apk add --no-cache cairo jpeg pango giflib
ENV NODE_ENV=production
# copy all from builder (includes node_modules already built)
COPY --from=builder /app/ .
EXPOSE 3000
CMD ["npm", "start"]
