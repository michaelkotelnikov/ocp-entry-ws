# Use Bitnami Node.js image
FROM bitnami/node:16

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --no-cache

# Copy application code
COPY . .

# Expose the React development server's port
EXPOSE 3000

# Run as the non-root user provided by the Bitnami image
CMD ["npm", "start"]

