# ---------- Base Image ----------
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy rest of backend code
COPY . .

# Expose backend port
EXPOSE 5000

# Start backend using app.js
CMD ["npm", "start"]
