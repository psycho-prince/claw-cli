# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./agent-cli/
COPY tsconfig.json ./agent-cli/
COPY .npmrc ./agent-cli/ || true # Copy .npmrc if it exists

RUN npm install --prefix ./agent-cli

COPY . ./

WORKDIR /app/agent-cli

RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy production dependencies from builder stage
COPY --from=builder /app/agent-cli/package*.json ./agent-cli/
RUN npm install --prefix ./agent-cli --only=production

# Copy built application and other necessary files
COPY --from=builder /app/agent-cli/dist ./agent-cli/dist
COPY --from=builder /app/LICENSE ./
COPY --from=builder /app/README.md ./
COPY --from=builder /app/CLI_AGENT_README.md ./
COPY --from=builder /app/SECURITY.md ./
COPY --from=builder /app/.github/FUNDING.yml ./.github/FUNDING.yml

# For server mode (if implemented)
COPY --from=builder /app/server ./server || true

WORKDIR /app/agent-cli

EXPOSE 3000

CMD ["node", "dist/index.js"]
