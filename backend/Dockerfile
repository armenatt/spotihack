FROM node:22

WORKDIR /usr/local/src

RUN apt-get upgrade && apt-get update

#Create app dir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g @nestjs/cli

#Install Dependencies
COPY package*.json /usr/src/app
RUN npm install

#Bundle app source
COPY . /usr/src/app

EXPOSE 3000
CMD [ "nest", "start" ]