const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying TreasureHunt...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH\n");

  const TreasureHunt = await hre.ethers.getContractFactory("TreasureHunt");
  const game = await TreasureHunt.deploy();
  await game.waitForDeployment();

  const address = await game.getAddress();

  console.log("✅ Deployed to:", address);
  
  const gridSize = await game.GRID_SIZE();
  const side = Math.sqrt(Number(gridSize));
  
  console.log("\n📋 Settings:");
  console.log(`   Grid: ${side}x${side} (${gridSize} squares)`);
  console.log("   Dig Cost: 0.001 ETH");
  console.log("   Game ID:", (await game.gameId()).toString());

  console.log(
    "\n🔗 BaseScan:",
    `https://sepolia.basescan.org/address/${address}`
  );
  console.log("\n📝 Add to frontend: NEXT_PUBLIC_CONTRACT_ADDRESS=" + address);
}

main().catch(console.error);
