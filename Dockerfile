FROM ubuntu:18.04 as prod
#setting up ubuntu
RUN apt-get update && \
      apt-get -y install sudo

RUN useradd -m docker && echo "docker:docker" | chpasswd && adduser docker sudo

USER docker

EXPOSE 80
EXPOSE 8050

#installing nodejs
RUN cd ~
RUN curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
RUN sudo bash nodesource_setup.sh
run sudo apt install nodejs

#getting the code
WORKDIR /app
COPY /index/package*.json .
RUN npm install
COPY . .
RUN npm run build
RUN npm run server

#setup nginx
