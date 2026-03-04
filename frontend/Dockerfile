FROM node:22

WORKDIR /usr/src/app

RUN apt-get update && apt-get upgrade -y

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV PORT=3001
CMD ["node", ".output/server/index.mjs"]