FROM node:16.3.0-alpine as builder

ENV NODE_ENV production
RUN apk add --update --no-cache python3 make g++ && ln -sf python3 /usr/bin/python

COPY . /app
WORKDIR /app

RUN npm ci --quiet --also=dev
RUN npm run build

RUN ls -al /app/build

FROM node:16.3.0-alpine

ENV NODE_ENV production

WORKDIR /app
COPY --from=builder /app/build /app

CMD [ "node", "/app/app/server.js" ]

EXPOSE 4000
