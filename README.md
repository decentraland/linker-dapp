# Linker DApp UI

This UI bridges the Decentraland CLI and blockchain, enabling users to deploy scenes to LAND parcels or Worlds, manage World access control lists (ACL), perform storage operations, create quests, view server logs, and create ephemeral identities for signing deployments.

## Table of Contents

- [Features](#features)
- [Dependencies & Related Services](#dependencies--related-services)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the UI](#running-the-ui)
- [Local Development](#local-development)
- [Testing](#testing)

## Features

- **Scene Deployment**: Deploy scenes to LAND parcels and Worlds with authorization checks
- **World ACL Management**: Grant and revoke deployer permissions for Worlds
- **Storage Operations**: Get, set, delete, and clear data for scene, player, and environment storage
- **Quest Management**: Create and manage quests
- **Server Logs**: View real-time server logs for Worlds
- **Ephemeral Identity**: Create temporary identities for signing deployments

## Dependencies & Related Services

This service interacts with the following services:

- **[@dcl/sdk-commands](https://github.com/decentraland/js-sdk-toolchain/tree/main/packages/%40dcl/sdk-commands)**: Serves the local API server that the Linker DApp communicates with
- **LAND Registry Contract**: Verifies parcel ownership and authorization for deployments
- **Estate Registry Contract**: Verifies estate ownership and authorization for deployments
- **Decentraland Auth Service**: Handles wallet authentication via `/auth` proxy

## Getting Started

### Prerequisites

Before running this service, ensure you have the following installed:

- **Node.js**: Version 24.x or higher (see `.nvmrc`)
- **npm**: Version 10.x or higher

### Installation

1. Clone the repository:

```bash
git clone https://github.com/decentraland/linker-dapp.git
cd linker-dapp
```

2. Install dependencies:

```bash
npm install
```

### Configuration

The UI uses the `@dcl/ui-env` module to configure the environment in which the UI will run.

All of these different configurations are located under the `/src/config/env` directory, where a `json` file can be found for each environment.
This package automatically loads the environment file for each site in production (zone, today, org) and can be configured to run on a different
environment while live by using the `?env=` query parameter with the desired environment, i.e: `?env=prod`.

In order to configure the starting environment of the site in the development mode, create a new `.env` file based on the `.env.default`.
The `.env.default` also contains other variables that are usually modified at build time.

### Running the UI

Running the start command will result in the Vite development server to start.

```bash
npm run start
```

## Local Development

**Architecture Note:** In production, the Linker DApp is served by the sdk-commands Express server, which handles both the static files and `/api` endpoints. For local development with hot-reload, we run Vite's dev server separately and proxy API requests to a running sdk-commands instance.

**Steps:**

1. In a Decentraland scene directory, start the sdk-commands server:

```bash
npx @dcl/sdk-commands deploy
# or
npx @dcl/sdk-commands world-acl
# or
npx @dcl/sdk-commands storage
```

This starts a server on port 8000 by default.

2. In the linker-dapp directory, configure the API proxy target in `.env`:

```bash
VITE_API_PROXY_TARGET=http://localhost:8000
```

3. Start the Vite dev server:

```bash
npm run start
```

4. Open the Vite dev server URL (usually `http://localhost:5173`) to develop with hot-reload.

**Note:** The `/auth` proxy to `https://decentraland.zone` is always enabled for wallet authentication.

## Testing

This UI contains tests that assert the behavior of components, stores and business logic.

### Running tests

Run all tests:

```bash
npm run test
```

### Test Structure

Tests are written in files named along the file they're testing with a `.spec.ts` extension.

```
src/
  modules/
    acl/
      actions.ts
      actions.spec.ts
      reducer.ts
      reducer.spec.ts
```

## AI Agent Context

For detailed AI Agent context, see [docs/ai-agent-context.md](docs/ai-agent-context.md).

---
