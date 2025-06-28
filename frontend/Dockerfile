FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

RUN npm run build

# Install serve to serve the static files
RUN npm install -g serve

# Serve the build folder
CMD ["serve", "-s", "build", "-l", "3000"]