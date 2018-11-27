FROM ruby:2.5.3-alpine
MAINTAINER Eric Youngberg <eyoungberg@mapc.org>

WORKDIR /usr/src/app
VOLUME /usr/src/app
EXPOSE 9292

COPY Gemfile* ./

RUN set -ex \
    ; \
    apk update \
    && apk add --no-cache \
      build-base \
      postgresql \
      postgresql-dev \
    ; \
    bundle install

CMD rm -f tmp/pids/server.pid && rackup -o 0.0.0.0
