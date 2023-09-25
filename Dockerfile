# Stage 1: Build Angular app
FROM node:latest as node
WORKDIR /app
COPY ./app .
RUN npm install --legacy-peer-deps
RUN npm run build --prod

# Stage 2: Set up Nginx
FROM nginx:alpine

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app from the first stage
COPY --from=node /app/dist/seller-panel /usr/share/nginx/html

# Expose port 80 for the Nginx web server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]