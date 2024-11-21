# Use a Node.js base image
FROM node:16

# update env variables
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_DATABASE=${DB_DATABASE}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_TYPE=${DB_TYPE}
ENV PORT=${PORT}

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install -g typescript

# Copy the source code
COPY . .

# Rebuild bcrypt for the correct architecture
RUN npm rebuild bcrypt --build-from-source

# Build TypeScript code
RUN npm run build

# Expose the port (if needed)
EXPOSE 3005

# Start the application
CMD ["npm", "start"]