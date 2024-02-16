FROM public.ecr.aws/docker/library/node:18-alpine
FROM mcr.microsoft.com/playwright:v1.37.1-jammy

ENV PORT 3000

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/
COPY patches ./patches

RUN npm install pm2 -g
RUN yarn

# Copying source files
COPY . /usr/src/app

#before we run the app we need to run the tests
RUN yarn test

# start app
RUN yarn build
EXPOSE 3000

# Launch app with PM2
CMD ["pm2-runtime", "start", "npm", "--", "start"]