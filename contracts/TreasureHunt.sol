// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title TreasureHunt - A simple blockchain treasure hunt game
/// @notice Players dig on a 3x3 grid. Dig costs 1 ETH, winner gets 5 ETH!
contract TreasureHunt {
    // ============ Game Settings ============
    uint8 public constant GRID_SIZE = 9; // 3x3 grid
    uint256 public constant DIG_COST = 0.001 ether; // Testnet-friendly
    uint256 public constant PRIZE = 0.005 ether; // Testnet-friendly

    // ============ State ============
    address public owner;
    uint256 public gameId;
    uint256 public prizePool;
    uint8 private treasureLocation;

    mapping(uint256 => mapping(uint8 => bool)) public revealed;

    // ============ Events ============
    event Dug(uint256 gameId, address player, uint8 position, bool won);
    event GameStarted(uint256 gameId);
    event PrizeSent(address winner, uint256 amount);

    // ============ Constructor ============
    constructor() {
        owner = msg.sender;
        _newGame();
    }

    // ============ Main Function ============
    function dig(uint8 position) external payable {
        require(position < GRID_SIZE, "Invalid position");
        require(msg.value >= DIG_COST, "Pay 0.001 ETH");
        require(!revealed[gameId][position], "Already dug");
        require(prizePool >= PRIZE, "Pool too low"); // Ensure we can pay winner

        prizePool += msg.value;
        revealed[gameId][position] = true;

        bool won = (position == treasureLocation);
        emit Dug(gameId, msg.sender, position, won);

        if (won) {
            prizePool -= PRIZE;
            emit PrizeSent(msg.sender, PRIZE);
            (bool success, ) = payable(msg.sender).call{value: PRIZE}("");
            require(success, "Transfer failed");
            _newGame();
        }
    }

    // ============ View Functions ============
    function isRevealed(uint8 position) external view returns (bool) {
        return revealed[gameId][position];
    }

    function getGameState() external view returns (uint256, uint256, uint8) {
        uint8 count = 0;
        for (uint8 i = 0; i < GRID_SIZE; i++) {
            if (revealed[gameId][i]) count++;
        }
        return (gameId, prizePool, count);
    }

    // ============ Internal ============
    function _newGame() private {
        gameId++;
        treasureLocation = uint8(
            uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, block.prevrandao, gameId)
                )
            ) % GRID_SIZE
        );
        emit GameStarted(gameId);
    }

    // ============ Admin ============
    function seedPool() external payable {
        prizePool += msg.value;
    }
}
