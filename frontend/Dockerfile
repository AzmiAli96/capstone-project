FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NEXT_PUBLIC_API_URL=https://api.gemilangcargo.com

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]