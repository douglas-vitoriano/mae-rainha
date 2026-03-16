FROM docker.io/library/ruby:3.2.8-slim AS base

RUN apt-get update && \
    apt-get install --yes --no-install-recommends \
      build-essential \
      git \
      curl \
      libssl-dev \
      libreadline-dev \
      zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*

RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME=/root/.volta
ENV PATH=$VOLTA_HOME/bin:$PATH
RUN volta install node@20 npm@latest

WORKDIR /app

FROM base AS gems

COPY Gemfile Gemfile.lock ./

RUN gem update --system --no-document && \
    gem install bundler --no-document && \
    bundle install --jobs 4 --retry 3

FROM base AS app

COPY --from=gems /usr/local/bundle /usr/local/bundle

COPY . .

RUN npm ci && \
    npm run esbuild && \
    bundle exec bridgetown build

RUN rm -rf node_modules

ENV BRIDGETOWN_ENV=production
ENV BRIDGETOWN_PORT=8080
ENV RUBY_YJIT_ENABLE=1

EXPOSE 8080

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]