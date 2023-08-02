#!/bin/sh
export AWS_ACCESS_KEY_ID=AKIAYO437S56L2UOZ3MW
export AWS_SECRET_ACCESS_KEY='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'

certbot certonly --non-interactive \
      --dns-route53 \
      --preferred-challenge dns \
      --agree-tos \
      --domains sigmyze.com,draco.sigmyze.com \
      --email sigmyze@gmail.com

nginx -g "daemon off;"

# BUILT ASSETS (E.G. JS BUNDLES)
# Browser cache - max cache headers from Next.js as build id in url
# Server cache - valid forever (cleared after cache "inactive" period)
location /_next/static {
      proxy_cache STATIC;
      proxy_pass http://application:3000;
}

# STATIC ASSETS (E.G. IMAGES)
# Browser cache - "no-cache" headers from Next.js as no build id in url
# Server cache - refresh regularly in case of changes
location /static {
      proxy_cache STATIC;
      proxy_ignore_headers Cache-Control;
      proxy_cache_valid 60m;
      proxy_pass http://application:3000;
}

location /api {
      proxy_set_header X-Forwarded-Host $host;
      proxy_set_header X-Forwarded-Server $host;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

      proxy_pass http://sigmyze-server:80;
}

location /quanta-socket {
      proxy_set_header X-Forwarded-Host $host;
      proxy_set_header X-Forwarded-Server $host;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

      proxy_pass http://quanta-server:5025;

      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "Upgrade";
      proxy_set_header Host $host;
}

# DYNAMIC ASSETS - NO CACHE
location / {
      proxy_pass http://application:3000;
}