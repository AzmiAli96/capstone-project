FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma prisma

COPY . .

RUN npm run build

RUN mkdir -p dist/uploads

EXPOSE 2000

CMD [ "node", "dist/src/server.js" ]