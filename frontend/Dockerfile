FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NEXT_PUBLIC_API_URL=http://192.168.221.41:2000/api

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]