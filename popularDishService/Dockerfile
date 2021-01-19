FROM node:14
WORKDIR /app_server
COPY package*.json ./
RUN npm install
COPY server/ ./server

EXPOSE 3001
CMD ["npm", "start"]
