FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["node", "src/index.js"]