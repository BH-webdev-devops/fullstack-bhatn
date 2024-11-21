# Use the official Node.js image as the base image
FROM node:19

ENV BACKEND_URL=${BACKEND_URL}

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Run lint
RUN npm run lint

# Build the Next.js application
RUN npm run build --legacy-peer-deps

# Expose the port the app runs on
EXPOSE ${BACKEND_URL}

# Start the Next.js application
CMD ["npm", "run", "dev"]