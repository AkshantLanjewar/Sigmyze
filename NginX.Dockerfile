FROM public.ecr.aws/docker/library/node:16-alpine3.14 as builder

WORKDIR /ui
COPY web/ui ./

WORKDIR /sigmyze-charting
COPY web/sigmyze-charting ./

RUN yarn install && yarn build
RUN yarn link

WORKDIR /ui

RUN yarn link sigmyze-charting
RUN yarn install && yarn build

FROM public.ecr.aws/nginx/nginx:1.23-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /ui/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]