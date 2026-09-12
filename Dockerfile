# Use official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Copy application source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose API port
EXPOSE 5000

# Start application
CMD ["npm", "run", "dev"]