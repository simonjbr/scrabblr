# FROM node:20
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 8080
# CMD ["node", "dist/index.js"]

# Use official Node image
FROM node:20

# Set working directory
WORKDIR /

# 1. Copy package files
COPY package*.json ./

# 2. Install production dependencies
RUN npm install

# 3. Copy ALL files (except those in .dockerignore)
COPY . .

# 4. Set runtime config
ENV PORT=8080
EXPOSE 8080

# Create uploads directory and set permissions
RUN mkdir -p uploads && \
    chown -R node:node uploads && \
    chmod -R 755 uploads

# 5. Run as non-root user (security best practice)
USER node

# 6. Start the app
# CMD ["node", "src/index.js"]  # Directly run JS file

# Correct CMD format (remove brackets if using shell form)
CMD node server.js