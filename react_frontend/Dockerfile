# Use official Node.js image as base
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

ARG REACT_APP_NAMESPACE
ENV REACT_APP_NAMESPACE ${REACT_APP_NAMESPACE}
RUN echo "REACT_APP_NAMESPACE=${REACT_APP_NAMESPACE}"

# Expose port 3000 to the outside world
EXPOSE 3000
EXPOSE 80

# Command to run the React app
CMD ["npm", "start"]

