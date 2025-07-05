FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma prisma

COPY . .

RUN npm run build

EXPOSE 2000

CMD [ "node", "dist/server.js" ]