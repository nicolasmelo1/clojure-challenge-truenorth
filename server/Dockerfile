FROM clojure:temurin-17-tools-deps-bullseye

ENV TRENCH_VERSION=0.4.0
ENV BB_COMMIT=965c177bca31ae9882c975ef7db448e12f59984e

RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*
RUN curl https://github.com/athos/trenchman/releases/download/v$TRENCH_VERSION/trenchman_${TRENCH_VERSION}_linux_amd64.tar.gz \
    --location --output trenchman.tar.gz && \
    tar -xf trenchman.tar.gz && \
    mv trench /usr/local/bin/
RUN curl -s https://raw.githubusercontent.com/babashka/babashka/$BB_COMMIT/install | bash

RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY resources ./resources
COPY src ./src
COPY bb ./bb
COPY bb.edn config.edn deps.edn .

CMD ["/bin/sh", "-c", "$(bb --force -e nil; bb run-cmd)"]