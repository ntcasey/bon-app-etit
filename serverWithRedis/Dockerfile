FROM node:14
WORKDIR /redis
COPY package*.json ./
RUN npm install
COPY redis_server/ ./redis_server

EXPOSE 3001
CMD ["npm", "start"]

