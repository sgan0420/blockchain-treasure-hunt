# 🏴‍☠️ Blockchain Treasure Hunt

A decentralized treasure hunt game built on Base (Ethereum L2). This project demonstrates the full stack of blockchain development: smart contracts, frontend integration, and wallet connectivity.

---

## 🎮 The Game

```
┌─────────────────────────────────────────────────────────────┐
│                    💎 TREASURE HUNT 💎                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│         [?]  [?]  [?]                                       │
│         [?]  [💎] [?]   ← Hidden treasure!                  │
│         [?]  [?]  [?]                                       │
│                                                             │
│    Dig Cost:  1 ETH                                         │
│    Prize:     5 ETH (fixed)                                 │
│    Pool:      10 ETH (grows with each dig)                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

HOW TO PLAY:
1. Connect your wallet (MetaMask)
2. Click a square to dig (costs 1 ETH)
3. Find the treasure → Win 5 ETH!
4. Game resets with new hidden treasure location
```

### Game Economics

| Parameter | Value |
|-----------|-------|
| Grid Size | 3×3 (9 squares) |
| Dig Cost | 1 ETH |
| Win Prize | 5 ETH (fixed) |
| Initial Pool | 10 ETH |

The pool is **self-sustaining**: each dig adds 1 ETH, winners take 5 ETH. On average, ~5 digs per game = break even!

---

## 🧠 What I Learned: Blockchain Fundamentals

### What is a Blockchain?

A blockchain is a **decentralized, immutable ledger** - a database that:
- Runs on thousands of computers (nodes) worldwide
- Cannot be changed once data is written
- Has no single owner or controller
- Uses cryptography to secure transactions

### Key Concepts

| Concept | Explanation |
|---------|-------------|
| **Node** | A computer running blockchain software, storing and validating transactions |
| **Transaction** | Any action on the blockchain (sending ETH, calling a function) |
| **Gas** | The fee paid to validators for processing your transaction |
| **Block** | A bundle of transactions added to the chain together |
| **Wallet** | Your identity on the blockchain (public address + private key) |
| **Smart Contract** | Code that lives on the blockchain and executes automatically |

### Public Key vs Private Key

```
Private Key (SECRET!)           Public Key (Address)
─────────────────────────────   ─────────────────────────────
0xac0974bec39a17e36ba4...       0xf39Fd6e51aad88F6F4ce6aB...

• Used to SIGN transactions     • Your public identity
• NEVER share this!             • Share freely (like email)
• Proves you own the account    • Where others send you ETH
• Can derive public key         • Cannot derive private key
```

### Layer 1 vs Layer 2

```
Layer 1 (Ethereum)              Layer 2 (Base)
─────────────────────────────   ─────────────────────────────
• Main blockchain               • Built on top of L1
• Maximum security              • Faster & cheaper
• Slower (~15 TPS)              • Bundles txs to L1
• Higher gas fees               • Lower gas fees
```

This project uses **Base** (L2) for cheaper transactions while inheriting Ethereum's security.

---

## 📜 Smart Contracts Explained

### What is a Smart Contract?

A smart contract is **code that lives on the blockchain**. Once deployed:
- It has its own address (like a wallet)
- It can hold and transfer ETH
- It executes automatically when called
- It's immutable (cannot be changed)
- Anyone can interact with it

Think of it like a **vending machine**: put in money, press button, get result. No human needed!

### Our Contract: TreasureHunt.sol

```solidity
contract TreasureHunt {
    // Settings
    uint8 public constant GRID_SIZE = 9;      // 3x3 grid
    uint256 public constant DIG_COST = 1 ether;
    uint256 public constant PRIZE = 5 ether;
    
    // State
    address public owner;                      // Who deployed
    uint256 public gameId;                     // Current game
    uint256 public prizePool;                  // Total ETH held
    uint8 private treasureLocation;            // Secret!
    
    // Main function
    function dig(uint8 position) external payable {
        // 1. Check: valid position, paid enough, not already dug
        // 2. Add payment to pool
        // 3. Mark square as revealed
        // 4. If treasure found: pay winner, start new game
    }
}
```

### How State is Stored

```
CONTRACT ADDRESS: 0x5FbDB2315678...
───────────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────┐
│                         STATE                               │
├─────────────────────────────────────────────────────────────┤
│  owner:              0xf39F...  (deployer)                  │
│  gameId:             1                                      │
│  prizePool:          10000000000000000000  (10 ETH in wei)  │
│  treasureLocation:   5  (private, not readable!)            │
│  revealed[1][0]:     true                                   │
│  revealed[1][3]:     true                                   │
│  ...                                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        BALANCE                              │
├─────────────────────────────────────────────────────────────┤
│  💰 10 ETH (real money stored at this address!)             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture & Data Flow

### Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          YOUR BROWSER                                   │
│                                                                         │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │  Next.js Frontend (page.tsx)                                     │  │
│   │                                                                  │  │
│   │  • Display game UI (grid, stats)                                 │  │
│   │  • Handle user clicks                                            │  │
│   │  • Call smart contract functions                                 │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│                              │                                          │
│                              ▼                                          │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │  Wagmi / Viem Libraries                                          │  │
│   │                                                                  │  │
│   │  • React hooks for blockchain                                    │  │
│   │  • Format transactions                                           │  │
│   │  • Handle wallet connection                                      │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│                              │                                          │
│                              ▼                                          │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │  MetaMask Wallet                                                 │  │
│   │                                                                  │  │
│   │  • Store your private key                                        │  │
│   │  • Sign transactions                                             │  │
│   │  • Show confirmation popup                                       │  │
│   └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                               │
                               │ JSON-RPC (HTTP)
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      BLOCKCHAIN NETWORK                                 │
│                                                                         │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐            │
│   │  Node 1   │  │  Node 2   │  │  Node 3   │  │  Node N   │            │
│   │           │  │           │  │           │  │           │            │
│   │  Full     │  │  Full     │  │  Full     │  │  Full     │            │
│   │  Copy     │  │  Copy     │  │  Copy     │  │  Copy     │            │
│   └───────────┘  └───────────┘  └───────────┘  └───────────┘            │
│                                                                         │
│   All nodes have IDENTICAL copy of:                                     │
│   • All transactions ever made                                          │
│   • All smart contract code                                             │
│   • All smart contract state                                            │
│                                                                         │
│   Your contract lives at: 0x5FbDB2315678afecb367f...                    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Transaction Flow: When You Click "Dig"

```
STEP 1: User clicks square #5
───────────────────────────────────────────────────────────────
Frontend calls: writeContract({ functionName: "dig", args: [5], value: 1 ETH })

STEP 2: Wagmi/Viem creates transaction
───────────────────────────────────────────────────────────────
{
  to: "0x5FbDB...",           // Contract address
  data: "0xf5f4...",          // Encoded function call: dig(5)
  value: "1000000000000000000" // 1 ETH in wei
}

STEP 3: MetaMask popup
───────────────────────────────────────────────────────────────
"TreasureHunt wants to call dig(5) and send 1 ETH"
[Reject] [Confirm]

STEP 4: MetaMask signs with your private key
───────────────────────────────────────────────────────────────
signature = sign(transaction, privateKey)
// This proves YOU authorized this transaction

STEP 5: Send to blockchain via JSON-RPC
───────────────────────────────────────────────────────────────
POST http://localhost:8545 (or https://sepolia.base.org)
{
  "method": "eth_sendRawTransaction",
  "params": [signedTransaction]
}

STEP 6: Node validates and executes
───────────────────────────────────────────────────────────────
• Is signature valid? ✓
• Does sender have enough ETH? ✓
• Execute dig(5) function
• Update contract state
• Emit events

STEP 7: Transaction included in block
───────────────────────────────────────────────────────────────
Block #12345 contains your transaction
All other nodes sync this block

STEP 8: Frontend receives confirmation
───────────────────────────────────────────────────────────────
Transaction receipt returned with:
• status: success
• events: [Dug(gameId=1, player=0x..., position=5, won=false)]
• gasUsed: 45000
```

---

## 📁 Project Structure

```
blockchain-treasure-hunt/
│
├── contracts/
│   └── TreasureHunt.sol          # The smart contract (Solidity)
│
├── scripts/
│   └── deploy.js                  # Deploys contract to blockchain
│
├── test/
│   └── TreasureHunt.test.js       # Automated tests for contract
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Main game UI component
│   │   │   ├── layout.tsx         # App wrapper
│   │   │   ├── providers.tsx      # Wagmi configuration
│   │   │   └── globals.css        # Styles
│   │   └── lib/
│   │       └── contract.ts        # Contract address & ABI
│   ├── .env.local                 # Environment variables
│   └── package.json               # Frontend dependencies
│
├── hardhat.config.js              # Hardhat configuration
├── package.json                   # Backend dependencies
└── .env                           # Private key (DO NOT COMMIT!)
```

### File Purposes

| File | Purpose |
|------|---------|
| `TreasureHunt.sol` | Game logic: dig function, prize distribution, randomness |
| `deploy.js` | Compile & deploy contract, seed initial prize pool |
| `hardhat.config.js` | Define networks (localhost, testnet, mainnet) |
| `page.tsx` | React component: grid UI, wallet connection, transactions |
| `providers.tsx` | Configure Wagmi with supported networks |
| `contract.ts` | Store deployed contract address and ABI |
| `.env` / `.env.local` | Secret keys and configuration |

### What is an ABI?

**ABI (Application Binary Interface)** is like a "menu" for your contract:

```typescript
// contract.ts - The ABI tells frontend what functions exist
export const CONTRACT_ABI = [
  {
    name: "dig",
    type: "function",
    inputs: [{ name: "position", type: "uint8" }],
    stateMutability: "payable",
  },
  {
    name: "Dug",
    type: "event",
    inputs: [
      { name: "gameId", type: "uint256" },
      { name: "player", type: "address" },
      { name: "position", type: "uint8" },
      { name: "won", type: "bool" },
    ],
  },
  // ... more functions and events
];
```

Without the ABI, the frontend wouldn't know how to encode function calls!

---

## 🚀 Running the Project

### Prerequisites

- Node.js 18+
- MetaMask browser extension
- Git

### Step 1: Clone & Install

```bash
git clone <your-repo>
cd blockchain-treasure-hunt

# Install backend (Hardhat) dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Start Local Blockchain

```bash
# Terminal 1: Start Hardhat node (local blockchain)
npx hardhat node
```

This creates:
- A local blockchain at `http://localhost:8545`
- 20 test accounts with 10,000 ETH each
- Console logs all transactions

### Step 3: Deploy Contract

```bash
# Terminal 2: Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

Output:
```
🚀 Deploying TreasureHunt...

Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Balance: 10000.0 ETH

✅ Deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

💰 Seeding prize pool with 10 ETH...
✅ Prize pool seeded!

📋 Settings:
   Grid: 3x3 (9 squares)
   Dig Cost: 1 ETH
   Prize: 5 ETH (fixed)
   Prize Pool: 10 ETH
   Game ID: 1

📝 Add to frontend: NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Step 4: Configure Frontend

```bash
# Create .env.local in frontend folder
cd frontend
echo "NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3" > .env.local
```

### Step 5: Configure MetaMask

1. **Add Hardhat Network to MetaMask:**
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`

2. **Import Test Account:**
   - Copy private key from Hardhat output (Account #1, not #0)
   - MetaMask → Import Account → Paste private key
   - You'll have 10,000 test ETH!

### Step 6: Start Frontend

```bash
# Terminal 3: Start Next.js dev server
cd frontend
npm run dev
```

Open `http://localhost:3000` - you should see the game!

### Step 7: Play!

1. Click "Connect Wallet" → MetaMask popup
2. Click any square to dig (confirm in MetaMask)
3. Watch transaction in Hardhat terminal
4. Find treasure → Win 5 ETH!

---

## 🌐 Deploying to Testnet

### Step 1: Get Test ETH

Go to a faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

Enter your wallet address → Get free test ETH

### Step 2: Create .env File

```bash
# In project root (NOT frontend)
echo "PRIVATE_KEY=your_metamask_private_key_here" > .env
```

⚠️ **Use a separate dev wallet!** Never use your main wallet's private key.

### Step 3: Deploy to Base Sepolia

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

### Step 4: Update Frontend

Update `frontend/.env.local` with the new contract address, then deploy to Vercel:

```bash
cd frontend
npm run build
# Deploy to Vercel, Netlify, or any hosting
```

---

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npx hardhat node` | Start local blockchain |
| `npx hardhat compile` | Compile smart contracts |
| `npx hardhat test` | Run contract tests |
| `npx hardhat run scripts/deploy.js --network localhost` | Deploy locally |
| `npx hardhat run scripts/deploy.js --network baseSepolia` | Deploy to testnet |
| `cd frontend && npm run dev` | Start frontend dev server |

---

## 📚 Key Libraries

| Library | Purpose |
|---------|---------|
| **Hardhat** | Ethereum development environment (compile, test, deploy) |
| **Solidity** | Programming language for smart contracts |
| **ethers.js** | JavaScript library for blockchain interaction (used by Hardhat) |
| **Next.js** | React framework for the frontend |
| **Wagmi** | React hooks for Ethereum (useAccount, useWriteContract, etc.) |
| **Viem** | TypeScript library for blockchain (underlying Wagmi) |
| **Tailwind CSS** | Utility-first CSS framework |

---

## 🔐 Security Notes

- **Private Key**: NEVER share or commit your private key
- **Testnet First**: Always test on testnet before mainnet
- **Dev Wallet**: Use a separate wallet for development
- **Randomness**: This contract uses pseudo-randomness (not secure for high-stakes)
- **Audits**: Real dApps should be professionally audited

---

## 📖 Learning Resources

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [Base Documentation](https://docs.base.org/)
- [Ethereum Developer Guide](https://ethereum.org/developers)

---

## 📄 License

MIT
