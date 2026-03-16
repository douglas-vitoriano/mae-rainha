FROM ruby:3.2.8

RUN sed -i "s/main/main non-free contrib/g" /etc/apt/sources.list.d/debian.sources \
  && apt-get update \
  && apt-get install -y --no-install-recommends curl git libpq-dev cron libreoffice ttf-mscorefonts-installer \
  && rm -rf /var/lib/apt/lists/* /usr/share/doc /usr/share/man \
  && apt-get clean \
  && useradd --create-home ruby \
  && mkdir /node_modules && chown ruby:ruby -R /node_modules

COPY Gemfile* ./
RUN gem install bundler
RUN bundle install --jobs $(nproc)
ENV PATH="${PATH}:/home/ruby/.local/bin"

COPY . .

EXPOSE 80
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
