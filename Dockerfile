################################################################################
#
# Base image for installing all dependencies.
#
################################################################################

# Base image for installing dependencies.
# Do not use the latest tag for the base image due to build issues with Terser.
# https://github.com/vercel/next.js/issues/69263
FROM node:22.6-alpine AS development

# Run application with user 'node'.
# It is not recommended to run applications with 'root' even within
# the containers.
USER node

# Create a directory with the node user to make sure permissions are correct.
RUN mkdir -p /home/node/app

# Set working directory.
WORKDIR /home/node/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json.
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./
COPY --chown=node:node packages/backend/package.json ./packages/backend/
COPY --chown=node:node packages/frontend/package.json ./packages/frontend/

# Install dependencies and ensure sub node_modules folders exists otherwise later
# COPY commands could fail.
RUN npm ci --quiet --include=dev --ignore-scripts &&   \
     mkdir -p packages/backend/node_modules &&         \
     mkdir -p packages/frontend/node_modules

# Copy application sources.
COPY --chown=node:node . .

################################################################################
#
# Base image for building the production distribution.
#
################################################################################

# Base image for building the application.
# Do not use the latest tag for the base image due to build issues with Terser.
# https://github.com/vercel/next.js/issues/69263
FROM node:22.6-alpine AS build

# Install rsync
RUN apk update && apk add --no-cache rsync

# Run application with user 'node'.
# It is not recommended to run applications with 'root' even within
# the containers.
USER node

# Create a directory with the node user to make sure the permissions are
# correct.
RUN mkdir -p /home/node/app

# Set working directory.
WORKDIR /home/node/app

# Copy package.json and package-lock.json files to install dependencies.
COPY --chown=node:node package*.json ./
COPY --chown=node:node packages/backend/package.json ./packages/backend/
COPY --chown=node:node packages/frontend/package.json ./packages/frontend/

# Copy all installed dependencies from development phase.
# In order to run `npm run build` we need access to the Nest CLI which is a
# dev dependency.
# In the previous development stage we ran `npm ci` which installed all
# dependencies, so we can copy over the node_modules directory from the
# development image.
COPY --chown=node:node  \
     --from=development \
     /home/node/app/node_modules ./node_modules
COPY --chown=node:node  \
     --from=development \
     /home/node/app/packages/backend/node_modules ./packages/backend/node_modules
COPY --chown=node:node  \
     --from=development \
     /home/node/app/packages/frontend/node_modules ./packages/frontend/node_modules

# Copy application sources.
COPY --chown=node:node . .

# Define build argument for Sentry configs.
ARG SENTRY_AUTH_TOKEN_FRONTEND
ARG SENTRY_AUTH_TOKEN_BACKEND
ARG SENTRY_UPLOAD_SOURCEMAPS_FRONTEND
ARG SENTRY_UPLOAD_SOURCEMAPS_BACKEND

ENV SENTRY_AUTH_TOKEN_FRONTEND=$SENTRY_AUTH_TOKEN_FRONTEND
ENV SENTRY_AUTH_TOKEN_BACKEND=$SENTRY_AUTH_TOKEN_BACKEND
ENV SENTRY_UPLOAD_SOURCEMAPS_FRONTEND=$SENTRY_UPLOAD_SOURCEMAPS_FRONTEND
ENV SENTRY_UPLOAD_SOURCEMAPS_BACKEND=$SENTRY_UPLOAD_SOURCEMAPS_BACKEND

# Next.js build config.
ARG NEXT_BUILD_IGNORE_ESLINT
ARG NEXT_BUILD_IGNORE_TYPESCRIPT

ENV NEXT_BUILD_IGNORE_ESLINT=$NEXT_BUILD_IGNORE_ESLINT
ENV NEXT_BUILD_IGNORE_TYPESCRIPT=$NEXT_BUILD_IGNORE_TYPESCRIPT

# Set NODE_ENV to production before installing dependencies and building the
# application production bundle.
ENV NODE_ENV=production

# Run build command to generate production bundle and install dependencies.
#
# Running `npm ci` removes the existing node_modules directory and passing in
# --omit=dev ensures that only the production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible.
RUN npm run build && \
    npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force && \
    npm run prisma:generate -w backend
################################################################################
#
# Base image for running the production distribution.
#
################################################################################
# Do not use the latest tag for the base image due to build issues with Terser.
# https://github.com/vercel/next.js/issues/69263
FROM node:22.6-alpine AS production

# Set NODE_ENV to production for running the application.
ENV NODE_ENV=production

# Install Tini to overcome node PID1 issues.
#
# Do not run node process as PID 1, replace with some init software
# to properly manage SIGTERM and SIGINT events in node process.
# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#handling-kernel-signals
RUN apk update && \
    apk add --no-cache tini

# Run application with user 'node'.
# It is not recommended to run applications with 'root' even within
# the containers.
USER node

# Set working directory.
WORKDIR /home/node/app

# Copy the bundled code from the build stage to the production image.
COPY --chown=node:node --from=build /home/node/app/build ./
COPY --chown=node:node --from=build /home/node/app/node_modules ./node_modules

# Set Tini as an entrypoint to avoid running node process as PID 1.
# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#handling-kernel-signals
ENTRYPOINT ["/sbin/tini", "--"]

# Start the server using the production build.
CMD [ "node",  "backend/main.js" ]