#!/bin/sh
export AWS_ACCESS_KEY_ID=CHANGE_ME
export AWS_SECRET_ACCESS_KEY=''

certbot certonly --non-interactive \
      --dns-route53 \
      --preferred-challenge dns \
      --agree-tos \
      --domains sigmyze.com,alrigh.sigmyze.com \
      --email sigmyze@gmail.com \
     # --test-cert

nginx -g "daemon off;"
