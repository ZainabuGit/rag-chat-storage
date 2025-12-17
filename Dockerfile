# Use Node 20 Alpine for a small image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the NestJS app
RUN npm run build

# Environment
ENV NODE_ENV=production

# Expose the port Nest listens on
EXPOSE 3000

# Run the built app
CMD ["node", "dist/main.js"]
