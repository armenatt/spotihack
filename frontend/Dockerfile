FROM node:22

WORKDIR /usr/local/src

RUN apt-get upgrade && apt-get update

#Create app dir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app
RUN npm install

COPY . /usr/src/app


ENV PORT=3001
CMD [ "node", ".output/server/index.mjs" ]