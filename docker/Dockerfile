FROM nginx:1.20

ENV SRV_DIR /app
ENV NGINX_CONF /etc/nginx/nginx.conf
ENV WORK_DIR /work

# Create the srv directory
RUN mkdir ${SRV_DIR}

# Copy the built files to nginx
COPY ./dist ${SRV_DIR}

# Move over the server config
COPY ./docker/nginx.conf ${NGINX_CONF}

# Copy the start command
COPY ./docker/docker-start-command ${WORK_DIR}/docker-start-command

CMD ${WORK_DIR}/docker-start-command