FROM alpine:latest

RUN apk --no-cache add curl

# Downloading and installing Snyk
RUN curl https://static.snyk.io/cli/v1.666.0/snyk-linux -o snyk \
  && chmod +x ./snyk \
  && mv ./snyk /usr/local/bin/