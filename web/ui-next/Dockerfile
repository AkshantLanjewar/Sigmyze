FROM public.ecr.aws/docker/library/node:16.14.2-alpine

ENV PORT 3000

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/
RUN npm install pm2 -g
RUN yarn

# Copying source files
COPY . /usr/src/app

# start app
RUN yarn build
EXPOSE 3000

USER node

# Launch app with PM2
CMD ["pm2-runtime", "start", "npm", "--", "start"]