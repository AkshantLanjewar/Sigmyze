FROM public.ecr.aws/docker/library/nginx:alpine

#install certbot
RUN apk add python3 python3-dev py3-pip build-base libressl-dev musl-dev libffi-dev rust cargo certbot certbot-nginx
RUN pip3 install pip --upgrade
RUN pip3 install certbot
RUN pip3 install certbot-nginx
RUN pip3 install certbot-dns-route53
RUN mkdir /etc/letsencrypt

RUN apk add --no-cache certbot

# Remove any existing config files
RUN rm /etc/nginx/conf.d/*

# Copy config files
# *.conf files in "conf.d/" dir get included in main config
COPY ./default.conf /etc/nginx/conf.d/
COPY ./setup.sh /setup.sh
RUN chmod +x /setup.sh 

# Expose the listening port
EXPOSE 80

# Launch NGINX
CMD [ "../setup.sh" ]