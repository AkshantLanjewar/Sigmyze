#!/bin/sh
export AWS_ACCESS_KEY_ID=AKIAYO437S56L2UOZ3MW
export AWS_SECRET_ACCESS_KEY='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'

certbot certonly --non-interactive \
      --dns-route53 \
      --preferred-challenge dns \
      --agree-tos \
      --domains sigmyze.com,robinho.sigmyze.com \
      --email sigmyze@gmail.com

nginx -g "daemon off;"
