FROM alpine
MKDIR /app
WORKDIR /app
COPY . .

RUN apk add npm && npm install -g miniflare

ENTRYPOINT ["miniflare","index.js","--debug","--watch","--port","8008"]
