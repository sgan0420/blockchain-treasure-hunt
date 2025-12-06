# 🏴‍☠️ Blockchain Treasure Hunt

A decentralized treasure hunt game built on Base (Ethereum L2). Dig for hidden treasure on a 5x5 grid - find it and win the entire prize pool!

## 🎮 How It Works

```
┌─────────────────────────────────────────┐
│           💎 TREASURE HUNT 💎           │
├─────────────────────────────────────────┤
│                                         │
│    [?] [?] [?] [?] [?]                  │
│    [?] [?] [?] [?] [?]                  │
│    [?] [?] [💎] [?] [?]  ← Hidden!      │
│    [?] [?] [?] [?] [?]                  │
│    [?] [?] [?] [?] [?]                  │
│                                         │
│    Prize Pool: 0.25 ETH                 │
│    Cost per dig: 0.001 ETH              │
│                                         │
└─────────────────────────────────────────┘

1. Connect your wallet
2. Click a square to dig (costs 0.001 ETH)
3. Find the treasure → Win the entire prize pool!
4. Game resets with new hidden treasure
```

## 🏗️ Architecture

```
Frontend (Vercel)          Smart Contract (Base)
    │                            │
    │  ← Reads game state ─────  │
    │                            │
    │  ── Sends dig tx ────────> │
    │                            │
    │  ← Emits events ─────────  │
```

## 📁 Project Structure

```
blockchain-treasure-hunt/
├── contracts/
│   └── TreasureHunt.sol      # Game logic smart contract
├── scripts/
│   └── deploy.js             # Deployment script
├── test/
│   └── TreasureHunt.test.js  # Contract tests
├── frontend/                  # Next.js app (coming soon)
├── hardhat.config.js         # Hardhat configuration
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask wallet
- Some test ETH on Base Sepolia (free from faucet)

### 1. Install Dependencies

```bash
cd blockchain-treasure-hunt
npm install
```

### 2. Compile Smart Contract

```bash
npm run compile
```

### 3. Run Tests

```bash
npm run test
```

### 4. Deploy to Local Network (for testing)

```bash
# Terminal 1: Start local blockchain
npm run node

# Terminal 2: Deploy contract
npm run deploy:local
```

### 5. Deploy to Base Sepolia Testnet

```bash
# 1. Create .env file with your private key
echo "PRIVATE_KEY=your_private_key_here" > .env

# 2. Get free test ETH from: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

# 3. Deploy!
npm run deploy:testnet
```

## 🔧 Smart Contract Details

### Constants

- **Grid Size:** 5x5 (25 squares)
- **Dig Cost:** 0.001 ETH per square
- **Prize Pool:** Accumulates from all digs

### Functions

| Function                | Description                                     |
| ----------------------- | ----------------------------------------------- |
| `dig(position)`         | Dig at a position (0-24), pay dig cost          |
| `getGameInfo()`         | Get current game ID, prize pool, revealed count |
| `getRevealedSquares()`  | Get all revealed positions                      |
| `isSquareRevealed(pos)` | Check if specific square is revealed            |
| `seedPrizePool()`       | Add ETH to prize pool (optional)                |

### Events

| Event            | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `SquareDug`      | Emitted when a square is revealed                        |
| `TreasureFound`  | Emitted when treasure is found (includes winner & prize) |
| `NewGameStarted` | Emitted when a new game begins                           |

## 🌐 Networks

| Network                | Chain ID | RPC URL                  |
| ---------------------- | -------- | ------------------------ |
| Base Sepolia (testnet) | 84532    | https://sepolia.base.org |
| Base (mainnet)         | 8453     | https://mainnet.base.org |

## 📝 Environment Variables

Create a `.env` file:

```env
# Required: Your wallet private key (for deployment)
PRIVATE_KEY=your_private_key_here

# Optional: For contract verification
BASESCAN_API_KEY=your_api_key
```

⚠️ **NEVER commit your `.env` file or share your private key!**

## 🎯 Roadmap

- [x] Smart contract
- [x] Contract tests
- [x] Deployment scripts
- [ ] Frontend UI
- [ ] Wallet connection
- [ ] Live on testnet
- [ ] Deploy to Vercel

## 📚 Learning Resources

- [Solidity Docs](https://docs.soliditylang.org/)
- [Hardhat Docs](https://hardhat.org/docs)
- [Base Docs](https://docs.base.org/)
- [wagmi Docs](https://wagmi.sh/)

## 📄 License

MIT
