// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IScoreBoard
 * @dev Interface for ScoreBoard contract
 * Provides functions for managing game scores and leaderboards
 */
interface IScoreBoard {
    // ================================
    // STRUCTS
    // ================================
    struct Score {
        uint256 score;
        uint256 timestamp;
        string playerName;
        bytes32 gameHash; // Hash to verify score authenticity
    }

    struct LeaderboardEntry {
        uint256 score;
        string playerName;
        address playerAddress;
    }

    // ================================
    // EVENTS
    // ================================
    event ScoreRecorded(
        address indexed player,
        uint256 score,
        uint256 timestamp,
        bytes32 gameHash
    );
    event ScoreRecordedWithRICE(
        address indexed player,
        uint256 score,
        uint256 riceReward,
        uint256 timestamp,
        bytes32 gameHash
    );
    event BestScoreUpdated(address indexed player, uint256 newBestScore);
    event GameOwnerUpdated(address indexed oldOwner, address indexed newOwner);
    event ContractPaused(bool paused);
    event SecurityKeyUpdated(bytes32 newKey);
    event RICEManagerAddressUpdated(address indexed newAddress);

    // ================================
    // VIEW FUNCTIONS
    // ================================

    /**
     * @dev Gets all scores for a player
     * @param _player The player's address
     * @return Array of Score structs
     */
    function getPlayerScores(
        address _player
    ) external view returns (Score[] memory);

    /**
     * @dev Gets the best score for a player
     * @param _player The player's address
     * @return The player's best score
     */
    function getPlayerBestScore(
        address _player
    ) external view returns (uint256);

    /**
     * @dev Gets the number of scores for a player
     * @param _player The player's address
     * @return Number of scores
     */
    function getScoreCount(address _player) external view returns (uint256);

    /**
     * @dev Gets the global leaderboard with pagination
     * @param _offset Starting index for pagination
     * @param _limit Number of entries to return
     * @return Array of LeaderboardEntry structs
     */
    function getLeaderboard(
        uint256 _offset,
        uint256 _limit
    ) external view returns (LeaderboardEntry[] memory);

    /**
     * @dev Gets the total number of players in the leaderboard
     * @return Total number of players
     */
    function getTotalScores() external view returns (uint256);

    /**
     * @dev Gets contract information
     * @return _gameOwner The game owner address
     * @return _paused Whether the contract is paused
     * @return _minTimeBetweenScores Minimum time between scores
     * @return _securityKeySet Whether security key is set
     */
    function getContractInfo()
        external
        view
        returns (
            address _gameOwner,
            bool _paused,
            uint256 _minTimeBetweenScores,
            bool _securityKeySet
        );

    // ================================
    // STATE-CHANGING FUNCTIONS
    // ================================

    /**
     * @dev Records a score with signature verification
     * @param _score The score to record
     * @param _playerName The player's name
     * @param _gameHash Unique game hash to verify authenticity
     * @param _signature Signature created with the security key
     */
    function recordScore(
        uint256 _score,
        string memory _playerName,
        bytes32 _gameHash,
        bytes memory _signature
    ) external;

    /**
     * @dev Records a score and adds RICE rewards in a single transaction
     * @param _score The score to record
     * @param _playerName The player's name
     * @param _riceReward The amount of RICE to add as reward
     * @param _gameHash Unique game hash to verify authenticity
     * @param _signature Signature created with the security key
     */
    function recordScoreWithRICE(
        uint256 _score,
        string memory _playerName,
        uint256 _riceReward,
        bytes32 _gameHash,
        bytes memory _signature
    ) external;

    /**
     * @dev Emergency function to record a score without signature (for testing)
     * @param _score The score to record
     * @param _playerName The player's name
     * @param _playerAddress The player's address
     * @param _gameHash Unique game hash
     */
    function recordScoreEmergency(
        uint256 _score,
        string memory _playerName,
        address _playerAddress,
        bytes32 _gameHash
    ) external;

    // ================================
    // ADMIN FUNCTIONS
    // ================================

    /**
     * @dev Sets the game owner
     * @param _newOwner The new game owner address
     */
    function setGameOwner(address _newOwner) external;

    /**
     * @dev Pauses or unpauses the contract
     * @param _paused True to pause, false to unpause
     */
    function setPaused(bool _paused) external;

    /**
     * @dev Sets the security key for signing scores
     * @param _securityKey The new security key
     */
    function setSecurityKey(bytes32 _securityKey) external;

    /**
     * @dev Sets the RICEManager contract address
     * @param _riceManagerAddress The address of the RICEManager contract
     */
    function setRICEManagerAddress(address _riceManagerAddress) external;
}
