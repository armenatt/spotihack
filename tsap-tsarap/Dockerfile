FROM node:22

WORKDIR /usr/local/src

RUN apt-get upgrade && apt-get update
RUN apt-get install ffmpeg -y

RUN mkdir /usr/local/yt-dlp
WORKDIR /usr/local/yt-dlp

RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/yt-dlp/yt-dlp
RUN chmod a+rx /usr/local/yt-dlp/yt-dlp

# Custom Builds go here
RUN ffmpeg -version
# =================================


#Create app dir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#Install Dependencies
COPY package*.json /usr/src/app
RUN npm install

#Bundle app source
COPY . /usr/src/app

EXPOSE 3000
CMD [ "npm", "start" ]