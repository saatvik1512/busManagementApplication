# Stage 1: Build the React application
# Use an official Node.js runtime as the base image for building
# Choose a version compatible with your project (18 is common and works well)
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first
# This leverages Docker's layer caching. If these files don't change,
# the 'npm install' layer below won't need to re-run.
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application source code into the container
COPY . .

# Build the app for production. This creates the 'dist' folder.
# Make sure the command matches the 'build' script in your package.json
RUN npm run build


# Stage 2: Serve the app using Nginx
# Use the official Nginx image from Docker Hub (alpine version is lightweight)
FROM nginx:alpine

# Copy the built app (the 'dist' folder) from the 'build' stage
# into Nginx's default public directory (/usr/share/nginx/html).
# This makes the static files served by Nginx.
COPY --from=build /app/dist /usr/share/nginx/html

# --- Optional but Recommended for React Router SPAs ---
# If your React app uses React Router for navigation, you need to configure
# Nginx to handle client-side routing correctly.
# When a user visits a direct URL (like /admin/dashboard), Nginx should
# serve the main index.html file so React Router can take over.

# Create a custom Nginx configuration file
# (This replaces the default Nginx server block configuration)
RUN echo 'server { \
    listen 80; \
    listen [::]:80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    error_page 404 /index.html; \
    location = /index.html { \
        internal; \
    } \
}' > /etc/nginx/conf.d/default.conf
# --- End Optional SPA Configuration ---

# Make port 80 available to the world outside this container
# Nginx will listen on port 80 inside the container.
EXPOSE 80

# The base Nginx image already has an ENTRYPOINT and CMD that start Nginx.
# So, we don't need to specify one here. It will start Nginx in the foreground
# when the container runs, serving the static files.