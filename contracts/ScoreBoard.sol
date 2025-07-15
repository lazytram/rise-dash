// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ScoreBoard {
    struct Score {
        uint256 score;
        uint256 timestamp;
        string playerName;
        bytes32 gameHash; // Hash to verify score authenticity
    }

    mapping(address => Score[]) public playerScores;
    mapping(address => uint256) public playerBestScore;
    mapping(address => uint256) public lastScoreTimestamp; // Anti-spam protection
    mapping(bytes32 => bool) public usedGameHashes; // Prevent score reuse

    uint256 public constant MIN_TIME_BETWEEN_SCORES = 30 seconds; // Minimum time between scores

    address public gameOwner; // Address authorized to record scores
    bool public paused = false;

    event ScoreRecorded(address indexed player, uint256 score, uint256 timestamp, bytes32 gameHash);
    event BestScoreUpdated(address indexed player, uint256 newBestScore);
    event GameOwnerUpdated(address indexed oldOwner, address indexed newOwner);
    event ContractPaused(bool paused);

    modifier onlyGameOwner() {
        require(msg.sender == gameOwner, "Only game owner can call this function");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    constructor() {
        gameOwner = msg.sender;
    }

    /**
     * @dev Records a score - ONLY THE GAME OWNER CAN CALL THIS FUNCTION
     * @param _score The score to record
     * @param _playerName The player's name
     * @param _playerAddress The player's address
     * @param _gameHash Unique game hash to verify authenticity
     */
    function recordScore(
        uint256 _score,
        string memory _playerName,
        address _playerAddress,
        bytes32 _gameHash
    ) public onlyGameOwner whenNotPaused {
        require(_score > 0, "Score must be greater than 0");
        require(!usedGameHashes[_gameHash], "Game hash already used");
        require(
            block.timestamp >= lastScoreTimestamp[_playerAddress] + MIN_TIME_BETWEEN_SCORES,
            "Too soon since last score"
        );

        // Mark hash as used
        usedGameHashes[_gameHash] = true;

        Score memory newScore = Score({
            score: _score,
            timestamp: block.timestamp,
            playerName: _playerName,
            gameHash: _gameHash
        });

        playerScores[_playerAddress].push(newScore);
        lastScoreTimestamp[_playerAddress] = block.timestamp;

        // Update best score if this is higher
        if (_score > playerBestScore[_playerAddress]) {
            playerBestScore[_playerAddress] = _score;
            emit BestScoreUpdated(_playerAddress, _score);
        }

        emit ScoreRecorded(_playerAddress, _score, block.timestamp, _gameHash);
    }

    /**
     * @dev Emergency function to record a score without signature (for testing)
     * Only accessible by the game owner
     */
    function recordScoreEmergency(
        uint256 _score,
        string memory _playerName,
        bytes32 _gameHash
    ) public onlyGameOwner whenNotPaused {
        require(_score > 0, "Score must be greater than 0");
        require(!usedGameHashes[_gameHash], "Game hash already used");

        usedGameHashes[_gameHash] = true;

        Score memory newScore = Score({
            score: _score,
            timestamp: block.timestamp,
            playerName: _playerName,
            gameHash: _gameHash
        });

        playerScores[msg.sender].push(newScore);

        if (_score > playerBestScore[msg.sender]) {
            playerBestScore[msg.sender] = _score;
            emit BestScoreUpdated(msg.sender, _score);
        }

        emit ScoreRecorded(msg.sender, _score, block.timestamp, _gameHash);
    }

    function getPlayerScores(address _player) public view returns (Score[] memory) {
        return playerScores[_player];
    }

    function getPlayerBestScore(address _player) public view returns (uint256) {
        return playerBestScore[_player];
    }

    function getScoreCount(address _player) public view returns (uint256) {
        return playerScores[_player].length;
    }

    /**
     * @dev Administrative functions
     */
    function setGameOwner(address _newOwner) public onlyGameOwner {
        require(_newOwner != address(0), "Invalid address");
        address oldOwner = gameOwner;
        gameOwner = _newOwner;
        emit GameOwnerUpdated(oldOwner, _newOwner);
    }

    function setPaused(bool _paused) public onlyGameOwner {
        paused = _paused;
        emit ContractPaused(_paused);
    }

    function getContractInfo() public view returns (
        address _gameOwner,
        bool _paused,
        uint256 _minTimeBetweenScores
    ) {
        return (
            gameOwner,
            paused,
            MIN_TIME_BETWEEN_SCORES
        );
    }
}