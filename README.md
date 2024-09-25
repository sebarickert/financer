# Financer

Financer is a simple financial tracker app. You are able to track your monthly expenses and income as well as your savings and investments.

## 🚀 Quick start

This quick start guide should get you up and running in no time with local development environment.

## Requirements for Financer

- Docker 18.06.0+
- Docker Compose
- NVM
- Github account to create OAuth App

## Create new OAuth App for development purposes

Go to [github developer settings](https://github.com/settings/developers) and click `New OAuth App`

Fill the form with these:

- `Application name` as you want, doesn't matter.
- `Homepage URL` as `http://localhost:3000/`.
- `Authorization callback URL` as `http://localhost:3000/auth/github/redirect`.

Register application!

## Set up the local development environment

### Clone the repository

```
$ git clone git@github.com:shamalainen/financer.git
$ cd financer
```

### Add your OAuth tokens to the backend

```
$ cd backend
$ cp .env .env.local
```

Go modify that `.env.local` file in your IDE of choice. Add your tokens to `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

## Start the local development environment

### Use the correct node version

```
// Go back to the root of the repository.
$ ../
// Install the correct node version with nvm if prompted.
$ nvm use
// Install necessary node dependencies.
$ npm ci
```

#### Known issues

If `npm ci` doesn't work, do this:

```
// Delete node_modules and package-lock.json
$ rm -rf node_modules/ package-lock.json
// Install all dependencies.
$ npm i --legacy-peer-deps
```

### Start up docker

```
$ ./bin/startDevDocker
```

### Start up the backend and frontend

```
$ npm start
```

## Install new dependencies

### Frontend

```
$ npm --prefix frontend install DEPENDENCY-NAME
```

### Backend

```
$ npm --prefix backend install DEPENDENCY-NAME
```

#### Known issues

If backend fails after first authentication attempt, restart the backend.

```
$ npm start
```

## Production deployment

### Import the database in kubernetes

Get your database dump and copy it to your pod in kubernetes. Using to code sample below. Replace `mongodb-deployment-XXXXXXXXX-XXXXX` with your pod name. And finally remove dump from pod.

```
kubens financer
kubectl cp financer_2022-01-01_03-00.gz mongodb-deployment-XXXXXXXXX-XXXXX:/tmp/mongo.gz
kube exec mongodb-deployment-XXXXXXXXX-XXXXX -- bash -c 'mongorestore  -u $DB_USER -p $DB_PASSWORD --gzip --archive=/tmp/mongo.gz'
kube exec mongodb-deployment-XXXXXXXXX-XXXXX -- bash -c 'rm /tmp/mongo.gz'

```

## Authors

- **Sebastian Rickert** - [sebarickert](https://github.com/sebarickert)
- **Teemu Sillantaus** - [silte](https://github.com/silte)
