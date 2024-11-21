# Use a Node.js base image
FROM node:16

ARG DB_HOST
ARG DB_PORT
ARG DB_NAME
ARG DB_USER
ARG DB_PASSWORD
ARG DB_TYPE
ARG PORT

# update env variables
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_NAME=${DB_NAME}
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

EXPOSE ${PORT}

# Start the application
CMD ["npm", "start"]