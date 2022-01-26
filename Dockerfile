FROM alpine
RUN apk add npm libc-dev g++ nodejs-dev && npm install -g miniflare && mkdir /app
WORKDIR /app
COPY . .
RUN cd /app && ln -s /etc/secrets/.env || true


ENTRYPOINT ["miniflare","index.js","--debug","--watch","--port","8080"]
