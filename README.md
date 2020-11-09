# Passportjs + express + react template

- includes simple frontend for login test and backend that provides rest api for authentication

## Getting started

- Create new github oauth app
  - Goto https://github.com/settings/developers and click `New OAuth App`
  - Fill form and Register app
    - NOTE: `Authorization callback URL` is `http://localhost:3000/api/auth/github/redirect` when you are in dev mode (localhost)
  - Copy Client ID and Client secret to backend config file `backend/src/config/keys.ts` **NB: dont push your secrets to repo** @TODO: better env based solution

## Start the app

- Change to correct node version `nvm use`
- Start docker mongodb server `docker-compose -f ./docker/docker-compose.development.yaml up -d`
- Start backend node server (`npm start`)
- Start frontend react dev server (`npm start`)
