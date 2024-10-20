# Financer

Financer is a simple financial tracker app that helps you track monthly expenses, income, savings, and investments.

## Table of Contents

<!-- NOTE: To update doctoc please run `npx doctoc ./README.md --notitle` -->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [🚀 Quick Start](#-quick-start)
- [Requirements](#requirements)
- [Create an OAuth App for Development](#create-an-oauth-app-for-development)
- [Local Development Setup](#local-development-setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Add OAuth Tokens](#2-add-oauth-tokens)
- [Start the Development Environment](#start-the-development-environment)
  - [1. Use the correct Node version](#1-use-the-correct-node-version)
  - [2. Start Docker](#2-start-docker)
  - [3. Start the App](#3-start-the-app)
- [Installing New Dependencies](#installing-new-dependencies)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Production Tooling](#production-tooling)
  - [Update the Database version](#update-the-database-version)
- [Authors](#authors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

Edit the `.env.local` file and add your `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

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
$ npm -w frontend install DEPENDENCY-NAME
```

### Backend

```bash
$ npm -w backend install DEPENDENCY-NAME
```

## Production Tooling

### Update the Database version

1. Create a new backup from the database

```bash
kubectl create job --from=cronjob/postgres-backup postgres-backup-manual -n financer
```

2. Check that the backup was successful

```bash
kubectl get pods -n financer
```

You should find jobs `postgres-backup-manual-xxxxx` with status `Completed`. Example output:

```bash
NAME                          READY   STATUS      RESTARTS   AGE
postgres-backup-manual-x2nt9  0/1     Completed   0          61s
```

3. If the job status is Completed, delete the manual job

```bash
kubectl delete job postgres-backup-manual -n financer
```

4. Delete the existing PostgreSQL cluster

```bash
kubectl delete -f kubernetes/production.postgres-deployment.yaml
```

5. Deploy a new PostgreSQL instance with the latest version, update image tag before applying

```bash
kubectl apply -f kubernetes/production.postgres-deployment.yaml
```

6. Wait for the new PostgreSQL instance to be ready

```bash
kubectl rollout status statefulset/postgres-deployment -n financer
```

7. List all backups in the /backup folder

```bash
kubectl run -i --tty --rm list-backups --image=busybox --restart=Never --namespace=financer --overrides='
{
  "apiVersion": "v1",
  "spec": {
    "containers": [
      {
        "name": "list-backups",
        "image": "busybox",
        "stdin": true,
        "tty": true,
        "command": ["/bin/sh", "-c", "ls -lh /backup"],
        "volumeMounts": [
          {
            "name": "backup-volume",
            "mountPath": "/backup"
          }
        ]
      }
    ],
    "volumes": [
      {
        "name": "backup-volume",
        "persistentVolumeClaim": {
          "claimName": "postgres-backup-volume"
        }
      }
    ]
  }
}'
```

8. Restore the backup to the new PostgreSQL instance

Note: Please find the backup name from the list-backups output and use the backup that you created in step 1.

```bash
BACKUP_NAME=financer_20XX-XX-XX_XX-XX.backup
kubectl run -i --tty --rm postgres-restore --image=postgres:latest --restart=Never --namespace=financer --overrides="
{
  \"apiVersion\": \"v1\",
  \"spec\": {
    \"containers\": [
      {
        \"name\": \"postgres-restore\",
        \"image\": \"postgres:latest\",
        \"stdin\": true,
        \"tty\": true,
        \"command\": [\"/bin/sh\", \"-c\", \"PGPASSWORD=\$DB_PASSWORD pg_restore -U \$DB_USER -h \$DB_HOST -d \$DB_NAME /backup/$BACKUP_NAME\"],
        \"envFrom\": [
          {
            \"secretRef\": {
              \"name\": \"webapp-environment-secret\"
            }
          }
        ],
        \"volumeMounts\": [
          {
            \"name\": \"backup-volume\",
            \"mountPath\": \"/backup\"
          }
        ]
      }
    ],
    \"volumes\": [
      {
        \"name\": \"backup-volume\",
        \"persistentVolumeClaim\": {
          \"claimName\": \"postgres-backup-volume\"
        }
      }
    ]
  }
}"
```

9. Restart the web application deployment to refresh the DB connection

```bash
kubectl rollout restart deployment webapp-deployment -n financer
```

## Authors

- **Sebastian Rickert** - [sebarickert](https://github.com/sebarickert)
- **Teemu Sillantaus** - [silte](https://github.com/silte)
