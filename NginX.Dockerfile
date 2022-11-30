FROM node:16-alpine3.14 as react-stage

WORKDIR /react-stage

COPY web/ui .
COPY web/sigmyze-charting .

WORKDIR /react-stage/sigmyze-charting
RUN yarn link

WORKDIR /react-stage/ui

RUN yarn link sigmyze-charting
RUN yarn install && yarn build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY --from=react-stage /react-stage/ui/build .
COPY server.conf /etc/nginx/conf.d/