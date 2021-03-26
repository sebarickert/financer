FROM node:15.12.0-alpine as builder

ENV NODE_ENV production

COPY . /app
WORKDIR /app

RUN npm ci --quiet -f
RUN npm run build


FROM node:15.12.0-alpine

ENV NODE_ENV production

WORKDIR /app
COPY --from=builder /app/build /app

CMD [ "node", "/app/app/server.js" ]

EXPOSE 4000