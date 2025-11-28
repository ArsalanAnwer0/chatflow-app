# Base Image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose application port
EXPOSE 5000

# Run the application
CMD ["node", "src/server.js"]

