FROM node:15.1.0-alpine as builder

ENV NODE_ENV production

COPY . /app
WORKDIR /app

RUN npm ci --quiet -f
RUN npm run build


FROM node:15.1.0-alpine

ENV NODE_ENV production

WORKDIR /app
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/backend/build /app/build
COPY --from=builder /app/frontend/build /app/static/react-app

EXPOSE 4000