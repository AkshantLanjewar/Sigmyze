FROM node:16.14.2-alpine

ENV PORT 3000

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
RUN npm install --global pm2
RUN npm install

# Copying source files
COPY . /usr/src/app

# start app
RUN npm run build
EXPOSE 3000

USER node

# Launch app with PM2
CMD ["/bin/bash", "-c", "echo pm2-runtime start npm --start"]