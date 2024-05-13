# Build stage
FROM node:22-alpine as builder

ENV NODE_ENV production

RUN apk add --update --no-cache python3 make g++ && ln -sf python3 /usr/bin/python

WORKDIR /app

COPY . .

# Second `npm ci` nukes node_modules so we have regenerate prisma client after that
RUN npm ci --quiet --include=dev && \
    npm run build && \
    npm ci --omit=dev -w backend --ignore-scripts && \
    npm run prisma:generate -w backend

# Production stage
FROM node:22-alpine

ENV NODE_ENV production

WORKDIR /app

COPY --from=builder /app/build /app
COPY --from=builder /app/node_modules /app/node_modules

CMD [ "node", "/app/server/main.js" ]

EXPOSE 4000
