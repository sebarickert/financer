FROM node:20.5.0-alpine as builder

ENV NODE_ENV production
RUN apk add --update --no-cache python3 make g++ && ln -sf python3 /usr/bin/python

COPY . /app
WORKDIR /app


RUN npm ci --quiet --include=dev
RUN npm run build
RUN npm ci --omit=dev -w backend --ignore-scripts

RUN ls -al /app/build

FROM node:20.5.0-alpine

ENV NODE_ENV production

WORKDIR /app
COPY --from=builder /app/build /app
COPY --from=builder /app/node_modules /app/node_modules

CMD [ "node", "/app/server/main.js" ]

EXPOSE 4000
