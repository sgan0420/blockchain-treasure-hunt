const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TreasureHunt", function () {
  let game;
  let owner, player1, player2;
  const DIG_COST = ethers.parseEther("0.001"); // 0.001 ETH
  const PRIZE = ethers.parseEther("0.005"); // 0.005 ETH
  const SEED = ethers.parseEther("0.01"); // Seed pool

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();
    const TreasureHunt = await ethers.getContractFactory("TreasureHunt");
    game = await TreasureHunt.deploy();

    // Seed pool so digging is allowed (prizePool >= PRIZE required)
    await game.seedPool({ value: SEED });
  });

  describe("Setup", function () {
    it("Should initialize correctly", async function () {
      expect(await game.owner()).to.equal(owner.address);
      expect(await game.gameId()).to.equal(1);
      expect(await game.GRID_SIZE()).to.equal(9); // 3x3 grid
      expect(await game.DIG_COST()).to.equal(DIG_COST);
      expect(await game.PRIZE()).to.equal(PRIZE);
      expect(await game.prizePool()).to.equal(SEED);
    });
  });

  describe("Digging", function () {
    it("Should accept valid dig", async function () {
      await expect(game.connect(player1).dig(0, { value: DIG_COST })).to.emit(
        game,
        "Dug"
      );
    });

    it("Should reject without payment", async function () {
      await expect(game.connect(player1).dig(0)).to.be.revertedWith(
        "Pay 0.001 ETH"
      );
    });

    it("Should reject invalid position", async function () {
      await expect(
        game.connect(player1).dig(9, { value: DIG_COST })
      ).to.be.revertedWith("Invalid position");
    });

    it("Should reject double dig", async function () {
      await game.connect(player1).dig(0, { value: DIG_COST });

      if ((await game.gameId()) === 1n) {
        await expect(
          game.connect(player2).dig(0, { value: DIG_COST })
        ).to.be.revertedWith("Already dug");
      }
    });

    it("Should reject if pool too low", async function () {
      // Deploy fresh contract without seeding
      const TreasureHunt = await ethers.getContractFactory("TreasureHunt");
      const emptyGame = await TreasureHunt.deploy();

      await expect(
        emptyGame.connect(player1).dig(0, { value: DIG_COST })
      ).to.be.revertedWith("Pool too low");
    });
  });

  describe("Prize Pool", function () {
    it("Should accumulate payments", async function () {
      const initialPool = await game.prizePool();
      await game.connect(player1).dig(0, { value: DIG_COST });

      if ((await game.gameId()) === 1n) {
        expect(await game.prizePool()).to.equal(initialPool + DIG_COST);
      }
    });

    it("Should allow seeding", async function () {
      const extraSeed = ethers.parseEther("5");
      await game.seedPool({ value: extraSeed });
      expect(await game.prizePool()).to.equal(SEED + extraSeed);
    });
  });

  describe("Winning", function () {
    it("Should pay fixed prize and keep remaining pool", async function () {
      // Dig all 9 squares - must find treasure
      for (let i = 0; i < 9; i++) {
        const currentGame = await game.gameId();
        const poolBefore = await game.prizePool();

        await game.connect(player1).dig(i, { value: DIG_COST });

        if ((await game.gameId()) > currentGame) {
          // Winner found! Pool should have: (poolBefore + DIG_COST - PRIZE)
          const expectedPool = poolBefore + DIG_COST - PRIZE;
          expect(await game.prizePool()).to.equal(expectedPool);
          return;
        }
      }
    });

    it("Should emit PrizeSent event on win", async function () {
      for (let i = 0; i < 9; i++) {
        const currentGame = await game.gameId();
        const tx = await game.connect(player1).dig(i, { value: DIG_COST });

        if ((await game.gameId()) > currentGame) {
          await expect(tx)
            .to.emit(game, "PrizeSent")
            .withArgs(player1.address, PRIZE);
          return;
        }
      }
    });
  });

  describe("View Functions", function () {
    it("Should track revealed squares", async function () {
      await game.connect(player1).dig(4, { value: DIG_COST });

      if ((await game.gameId()) === 1n) {
        expect(await game.isRevealed(4)).to.be.true;
        expect(await game.isRevealed(0)).to.be.false;
      }
    });

    it("Should return game state", async function () {
      const [gameId, pool, count] = await game.getGameState();
      expect(gameId).to.equal(1);
      expect(pool).to.equal(SEED);
      expect(count).to.equal(0);
    });
  });
});
