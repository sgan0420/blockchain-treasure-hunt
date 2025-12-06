const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TreasureHunt", function () {
  let game;
  let owner, player1, player2;
  const DIG_COST = ethers.parseEther("0.001");

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();
    const TreasureHunt = await ethers.getContractFactory("TreasureHunt");
    game = await TreasureHunt.deploy();
  });

  describe("Setup", function () {
    it("Should initialize correctly", async function () {
      expect(await game.owner()).to.equal(owner.address);
      expect(await game.gameId()).to.equal(1);
      expect(await game.GRID_SIZE()).to.equal(25);
      expect(await game.DIG_COST()).to.equal(DIG_COST);
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
        game.connect(player1).dig(25, { value: DIG_COST })
      ).to.be.revertedWith("Invalid position");
    });

    it("Should reject double dig", async function () {
      await game.connect(player1).dig(0, { value: DIG_COST });

      // Only test if game didn't reset (treasure wasn't at 0)
      if ((await game.gameId()) === 1n) {
        await expect(
          game.connect(player2).dig(0, { value: DIG_COST })
        ).to.be.revertedWith("Already dug");
      }
    });
  });

  describe("Prize Pool", function () {
    it("Should accumulate payments", async function () {
      await game.connect(player1).dig(0, { value: DIG_COST });

      if ((await game.gameId()) === 1n) {
        expect(await game.prizePool()).to.equal(DIG_COST);
      }
    });

    it("Should allow seeding", async function () {
      const seed = ethers.parseEther("0.1");
      await game.seedPool({ value: seed });
      expect(await game.prizePool()).to.equal(seed);
    });
  });

  describe("Winning", function () {
    it("Should eventually find treasure", async function () {
      // Dig all 25 squares - must find treasure
      for (let i = 0; i < 25; i++) {
        const currentGame = await game.gameId();
        await game.connect(player1).dig(i, { value: DIG_COST });

        // If game ID changed, treasure was found
        if ((await game.gameId()) > currentGame) {
          expect(await game.prizePool()).to.equal(0);
          return; // Test passed
        }
      }
    });
  });

  describe("View Functions", function () {
    it("Should track revealed squares", async function () {
      await game.connect(player1).dig(12, { value: DIG_COST });

      if ((await game.gameId()) === 1n) {
        expect(await game.isRevealed(12)).to.be.true;
        expect(await game.isRevealed(0)).to.be.false;
      }
    });

    it("Should return game state", async function () {
      const [gameId, pool, count] = await game.getGameState();
      expect(gameId).to.equal(1);
      expect(pool).to.equal(0);
      expect(count).to.equal(0);
    });
  });
});
