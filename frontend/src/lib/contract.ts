export const CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) || "0x0";

export const CONTRACT_ABI = [
  {
    type: "function",
    name: "dig",
    inputs: [{ name: "position", type: "uint8" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "isRevealed",
    inputs: [{ name: "position", type: "uint8" }],
    outputs: [{ type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getGameState",
    inputs: [],
    outputs: [
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "uint8" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "GRID_SIZE",
    inputs: [],
    outputs: [{ type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "DIG_COST",
    inputs: [],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "Dug",
    inputs: [
      { name: "gameId", type: "uint256", indexed: true },
      { name: "player", type: "address", indexed: false },
      { name: "position", type: "uint8", indexed: false },
      { name: "won", type: "bool", indexed: false },
    ],
  },
  {
    type: "event",
    name: "GameStarted",
    inputs: [{ name: "gameId", type: "uint256", indexed: true }],
  },
  {
    type: "event",
    name: "PrizeSent",
    inputs: [
      { name: "winner", type: "address", indexed: false },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "function",
    name: "PRIZE",
    inputs: [],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
] as const;

export const DIG_COST = BigInt("1000000000000000"); // 0.001 ETH in wei
export const PRIZE = BigInt("5000000000000000"); // 0.005 ETH in wei
