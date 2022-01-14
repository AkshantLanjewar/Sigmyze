FROM ubuntu:18.04 as prod
#setting up ubuntu
RUN apt-get update && \
      apt-get -y install -y sudo

RUN adduser --disabled-password \
--gecos '' docker

RUN adduser docker sudo

RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> \
/etc/sudoers

USER docker

EXPOSE 80
EXPOSE 8050

RUN sudo apt-get update; sudo apt-get install -y curl 

#installing nodejs
RUN cd ~
RUN sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo bash
RUN sudo apt-get update; sudo apt install -y nodejs

#getting the code
RUN sudo mkdir /etc/app
WORKDIR /etc/app
COPY /index/package*.json ./
RUN sudo npm install
COPY . ./
RUN sudo npm run build
RUN sudo npm run server

#setup nginx
RUN apt-get update && apt-get install -y nginx
COPY app.conf /etc/nginx/conf.d/
CMD ["nginx"]