FROM python:3.8-slim

## Create a new user
RUN adduser --quiet --disabled-password --shell /bin/sh --home /home/dockeruser --gecos "" --uid 300 dockeruser

# Get jq
RUN apt update -y
RUN apt install jq -y

USER dockeruser
ENV HOME /home/dockeruser
ENV PYTHONPATH "${PYTHONPATH}:/home/dockeruser/.local/bin"
ENV PATH="/home/dockeruser/.local/bin:${PATH}"

# Add artifactory as a trusted pip index
RUN mkdir $HOME/.pip
RUN echo "[global]" >> $HOME/.pip/pip.conf
RUN echo "index-url = https://cae-artifactory.jpl.nasa.gov/artifactory/api/pypi/pypi-release-virtual/simple" >> $HOME/.pip/pip.conf
RUN echo "trusted-host = cae-artifactory.jpl.nasa.gov pypi.org" >> $HOME/.pip/pip.conf
RUN echo "extra-index-url = https://pypi.org/simple" >> $HOME/.pip/pip.conf

WORKDIR "/home/dockeruser"

RUN pip install --upgrade pip \
    && pip install awscli --upgrade \
    && pip install 'podaac-dev-tools>=0.7.0'

RUN pip list
CMD ["sh"]
