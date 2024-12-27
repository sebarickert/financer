# Financer Helm Chart

<!-- NOTE: To update doctoc please run `npx doctoc ./helm/README.md --notitle` -->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Pre-Installation Steps](#pre-installation-steps)
  - [Create Namespace](#create-namespace)
  - [Create Secrets](#create-secrets)
    - [`database-credentials`](#database-credentials)
    - [`cookie-secret`](#cookie-secret)
    - [`oauth2-credentials`](#oauth2-credentials)
- [Prepare Helm](#prepare-helm)
- [Install or Upgrade the Helm Chart](#install-or-upgrade-the-helm-chart)
  - [With Image Tag](#with-image-tag)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Pre-Installation Steps

### Create Namespace

Create the namespace `financer`:

```bash
kubectl create namespace financer
```

### Create Secrets

#### `database-credentials`

Create a secret with the database credentials.

Use the command:

```bash
kubectl create secret generic database-credentials  \
    --from-literal=DB_PASSWORD=<password>     \
    --namespace=financer
```

#### `cookie-secret`

Create a secret with the cookie secret.

Use the command:

```bash
kubectl create secret generic cookie-secret  \
    --from-literal=COOKIE_KEY=<password>     \
    --namespace=financer
```

#### `oauth2-credentials`

Create a secret with the OAuth2 credentials. Add settings that are needed for the selected OAuth2 authentication.

Use the command:

```bash
kubectl create secret generic oauth2-credentials    \
    --from-literal=GITHUB_CLIENT_ID=<secret>        \
    --from-literal=GITHUB_CLIENT_SECRET=<secret>    \
    --from-literal=AUTH0_DOMAIN=<secret>            \
    --from-literal=AUTH0_CLIENT_ID=<secret>         \
    --from-literal=AUTH0_CLIENT_SECRET=<secret>     \
    --namespace=financer
```

## Prepare Helm

Update Helm dependencies:

```bash
cd helm
helm dependency update
```

## Install or Upgrade the Helm Chart

To install or upgrade the Helm chart:

```bash
helm upgrade --install  \
    financer            \
    helm                \
    --namespace financer
```

### With Image Tag

To specify an image tag:

```bash
helm upgrade --install      \
    financer                \
    helm                    \
    --namespace financer    \
    --set application.image.tag=latest
```
