# Use node 22 for base image
FROM node:22-alpine

# Set /app for workdir
WORKDIR /app

# Copy package.json and yarn.lock for dependencies installation
COPY package.json yarn.lock /app/

# Install dependencies
RUN yarn install

# Copy all source code to /app folder
COPY . .

# Build code
RUN yarn build

# Expose port 3000
EXPOSE 3000

# Run app use node
CMD [ "node", "dist/src/main.js" ]
