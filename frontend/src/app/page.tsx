"use client";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { formatEther, parseEventLogs } from "viem";
import { useState, useEffect } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI, DIG_COST } from "@/lib/contract";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract, data: hash, isPending, reset } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });
  const client = usePublicClient();

  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [gameId, setGameId] = useState(BigInt(0));
  const [pool, setPool] = useState(BigInt(0));
  const [digging, setDigging] = useState<number | null>(null);
  const [won, setWon] = useState(false);

  // Load game state from blockchain
  const loadState = async () => {
    if (!client) return;
    try {
      // Get game info
      const state = (await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getGameState",
      })) as [bigint, bigint, number];
      setGameId(state[0]);
      setPool(state[1]);

      // Get revealed squares
      const squares = await Promise.all(
        Array.from({ length: 9 }, (_, i) =>
          client.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "isRevealed",
            args: [i],
          })
        )
      );
      setRevealed(squares as boolean[]);
    } catch (e) {
      console.error(e);
    }
  };

  // Init
  useEffect(() => {
    setReady(true);
    loadState();
  }, [client]);

  // After transaction success, reload state
  useEffect(() => {
    if (isSuccess && digging !== null) {
      // Check if won by seeing if game ID changed
      const checkWin = async () => {
        if (!client) return;
        const newState = (await client.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "getGameState",
        })) as [bigint, bigint, number];

        if (newState[0] > gameId) {
          // Game ID increased = we won!
          setWon(true);
          setTimeout(() => {
            setWon(false);
            setDigging(null);
            loadState();
          }, 3000);
        } else {
          setDigging(null);
          loadState();
        }
        reset();
      };
      checkWin();
    }
  }, [isSuccess]);

  // Dig
  const dig = (pos: number) => {
    if (!isConnected || revealed[pos] || isPending || digging !== null) return;
    setDigging(pos);
    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "dig",
        args: [pos],
        value: DIG_COST,
      },
      {
        onError: () => setDigging(null),
      }
    );
  };

  if (!ready)
    return (
      <div className="container">
        <h1 className="title">Loading...</h1>
      </div>
    );

  return (
    <div className="container">
      <h1 className="title">Treasure Hunt</h1>

      <div className="stats">
        <div className="stat">
          <div className="stat-value">{formatEther(pool)} ETH</div>
          <div className="stat-label">Prize Pool</div>
        </div>
        <div className="stat">
          <div className="stat-value">#{gameId.toString()}</div>
          <div className="stat-label">Game</div>
        </div>
      </div>

      {won && (
        <div className="message winner">🎉 YOU WON! Check your wallet!</div>
      )}
      {digging !== null && !won && <div className="message">⛏️ Digging...</div>}

      <div className="grid">
        {Array.from({ length: 9 }, (_, i) => (
          <button
            key={i}
            className={`square ${revealed[i] ? "revealed" : ""} ${
              won && digging === i ? "treasure" : ""
            } ${digging === i && !won ? "pending" : ""}`}
            onClick={() => dig(i)}
            disabled={!isConnected || revealed[i] || digging !== null}
          >
            {won && digging === i
              ? "💎"
              : digging === i
              ? "..."
              : revealed[i]
              ? "x"
              : "?"}
          </button>
        ))}
      </div>

      <button
        className={`connect-btn ${isConnected ? "connected" : ""}`}
        onClick={() =>
          isConnected ? disconnect() : connect({ connector: connectors[0] })
        }
      >
        {isConnected
          ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
          : "Connect Wallet"}
      </button>

      <p className="footer">1 ETH per dig</p>
    </div>
  );
}
