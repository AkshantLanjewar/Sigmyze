FROM public.ecr.aws/docker/library/nginx:alpine

#install certbot
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
ENTRYPOINT [ "../setup.sh" ]