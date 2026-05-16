FROM node:20-alpine

RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files
COPY package*.json ./

# Use npm install instead of npm ci (or ensure package-lock.json exists)
RUN npm install --only=production

# Copy source code
COPY . .

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

ENTRYPOINT ["dumb-init", "--"]

CMD ["sh", "-c", " npm run seed && npm start"]