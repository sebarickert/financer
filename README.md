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
- `Authorization callback URL` as `http://localhost:3000/api/auth/github/redirect`.

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

### Start up docker

```
$ docker-compose -f ./docker/docker-compose.development.yaml up -d
```

### Start up the backend and frontend

Open both the directories in own tabs in the terminal.

#### Backend

```
$ cd backend/
$ npm i
$ npm start
```

#### Frontend

```
$ cd frontend/
$ npm i
$ npm start
```

## Authors

- **Sebastian Hämäläinen** - [shamalainen](https://github.com/shamalainen)
- **Teemu Sillantaus** - [silte](https://github.com/silte)
