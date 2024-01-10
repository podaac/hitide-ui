FROM python:3.8-slim

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get upgrade -y \
    gcc \
    libnetcdf-dev \
    libhdf5-dev \
    hdf5-helpers \
    && apt-get -y install git \
    && apt-get install -y jq \
    && apt-get clean \
    && pip3 install git+https://github.com/podaac/cmr-association-diff.git@develop


RUN adduser --quiet --disabled-password --shell /bin/sh --home /home/dockeruser --uid 300 dockeruser

USER dockeruser
WORKDIR "/home/dockeruser"

# Add artifactory as a trusted pip index
ENV HOME /home/dockeruser
ENV PYTHONPATH "${PYTHONPATH}:/home/dockeruser/.local/bin"
ENV PATH="/home/dockeruser/.local/bin:${PATH}"

CMD ["sh"]