FROM node:10

WORKDIR /usr/src/app
COPY . .

RUN npm install -g miniflare

ENTRYPOINT ["miniflare","index.js","--debug","--watch","--port","8008"]
