# AI Agent Context

**Service Purpose:**

The Linker DApp is a web application that bridges the Decentraland CLI and blockchain, enabling users to deploy scenes to LAND parcels or Worlds, manage World access control lists (ACL), perform storage operations, create quests, view server logs, and create ephemeral identities for signing deployments.

**Key Capabilities:**

- Scene deployment to LAND parcels and Worlds with authorization checks
- World ACL management (grant/revoke deployer permissions)
- Storage operations (get/set/delete/clear) for scene, player, and environment data
- Quest creation and management
- Server logs viewing
- Ephemeral identity creation for deployment signing
- LAND/Estate authorization verification via smart contracts

**Communication Pattern:**

- REST APIs via local CLI server (`/api/*` endpoints proxied to `http://localhost:8000`)
- Blockchain interactions via ethers.js for LAND and Estate Registry contracts
- Signed requests using `@dcl/crypto` for authentication chains
- Proxied authentication to Decentraland auth service (`/auth` -> `https://decentraland.zone`)

**Technology Stack:**

- Runtime: Node.js v24.11.1
- Framework: React 17 with Redux and Redux-Saga for state management
- Build Tool: Vite with SWC
- Language: TypeScript 5.5
- UI Libraries: decentraland-ui, decentraland-dapps
- Blockchain: ethers.js v5, @dcl/crypto, decentraland-connect
- Testing: Jest with React Testing Library

**External Dependencies:**

- Local CLI Server (`http://localhost:8000`): Deployment, storage, logs, and info endpoints
  - `/api/info`: Scene deployment info (parcels, rootCID, title, description)
  - `/api/files`: File list and sizes
  - `/api/deploy`: POST deployment with auth chain
  - `/api/storage`: POST storage operations
  - `/api/logs`: POST logs authentication
  - `/api/catalyst-pointers`: Catalyst server info
  - `/api/close`: Close server connection
- LAND Registry Contract: Parcel ownership and authorization
  - Mainnet: `0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d`
  - Sepolia: `0x42f4ba48791e2de32f5fbf553441c2672864bb33`
- Estate Registry Contract: Estate ownership and authorization
  - Mainnet: `0x959e104e1a4db6317fa58f8295f586e1a978c297`
  - Sepolia: `0x369a7fbe718c870c79f99fb423882e8dd8b20486`
- Decentraland Auth Service: Wallet authentication
- Decentraland Play: Scene preview (`play.decentraland.org` / `play.decentraland.zone`)

**Key Concepts:**

- **LAND/Estate**: Virtual real estate NFTs in Decentraland; authorization is checked before deployment via smart contracts
- **World**: Personal deployment space where users can deploy scenes without owning LAND
- **ACL (Access Control List)**: Permission system for World deployments; manages owner and deployer addresses
- **Auth Chain**: Cryptographic authentication chain for signing deployment operations
- **Ephemeral Identity**: Temporary identity for signing deployments without exposing the main wallet
- **Storage Types**: `env`, `scene`, `player` - different scopes for persistent data storage
- **Portable Experience**: Special deployment type that can override scenes
- **Coords**: Parcel coordinates represented as `{x: number, y: number}`
