const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log("Deployer:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy
  const TreasureHunt = await hre.ethers.getContractFactory("TreasureHunt");
  const game = await TreasureHunt.deploy();
  await game.waitForDeployment();
  const address = await game.getAddress();
  console.log("✅ Deployed:", address);

  // Seed pool (use 10 ETH locally, less on testnet)
  const isLocal =
    hre.network.name === "localhost" || hre.network.name === "hardhat";
  const seedAmount = isLocal ? "10" : "0.01"; // 10 ETH local, 0.01 ETH testnet

  console.log(`💰 Seeding pool with ${seedAmount} ETH...`);
  await (
    await game.seedPool({ value: hre.ethers.parseEther(seedAmount) })
  ).wait();

  console.log(
    "✅ Pool:",
    hre.ethers.formatEther(await game.prizePool()),
    "ETH"
  );
  console.log("\n🔗 BaseScan: https://sepolia.basescan.org/address/" + address);
  console.log("📝 NEXT_PUBLIC_CONTRACT_ADDRESS=" + address);
}

main().catch(console.error);
