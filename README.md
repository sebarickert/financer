# Financer

Financer is a simple financial tracker app that helps you track monthly expenses, income, savings, and investments.

## 🚀 Quick Start

Follow this guide to quickly set up your local development environment.

## Requirements

- Docker
- Docker Compose
- NVM
- GitHub account (for OAuth setup)

## Create an OAuth App for Development

1. Visit the [GitHub Developer Settings](https://github.com/settings/developers) and click `New OAuth App`.
2. Fill out the form with the following details:

   - **Application Name:** Can be anything you like.
   - **Homepage URL:** `http://localhost:3000/`
   - **Authorization Callback URL:** `http://localhost:3000/auth/github/redirect`

3. Register the application.

## Local Development Setup

### 1. Clone the Repository

```bash
$ git clone git@github.com:sebarickert/financer.git
$ cd financer
```

### 2. Add OAuth Tokens

```bash
$ cd backend
$ cp .env .env.local
```

Edit the .env.local file and add your `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

## Start the Development Environment

### 1. Use the correct Node version

```bash
$ nvm use    # Install Node version (via nvm)
$ npm ci     # Install dependencies
```

### 2. Start Docker

```bash
$ ./bin/startDevDocker
```

### 3. Start the App

```bash
$ npm start
```

## Installing New Dependencies

### Frontend

```bash
$ npm --w frontend install DEPENDENCY-NAME
```

### Backend

```bash
$ npm --w backend install DEPENDENCY-NAME
```

## Authors

- **Sebastian Rickert** - [sebarickert](https://github.com/sebarickert)
- **Teemu Sillantaus** - [silte](https://github.com/silte)
