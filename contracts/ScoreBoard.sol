// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ScoreBoard {
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

    mapping(address => Score[]) public playerScores;
    mapping(address => uint256) public playerBestScore;
    mapping(address => uint256) public lastScoreTimestamp; // Anti-spam protection
    mapping(bytes32 => bool) public usedGameHashes; // Prevent score reuse

    // Global leaderboard tracking
    address[] public allPlayers;
    mapping(address => bool) public playerExists;
    mapping(address => string) public playerNames; // Store player names

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

        // Add player to global tracking if not already present
        if (!playerExists[_playerAddress]) {
            allPlayers.push(_playerAddress);
            playerExists[_playerAddress] = true;
            playerNames[_playerAddress] = _playerName;
        }

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

        // Add player to global tracking if not already present
        if (!playerExists[msg.sender]) {
            allPlayers.push(msg.sender);
            playerExists[msg.sender] = true;
            playerNames[msg.sender] = _playerName;
        }

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
     * @dev Gets the global leaderboard with pagination
     * @param _offset Starting index for pagination
     * @param _limit Number of entries to return
     * @return Array of LeaderboardEntry structs
     */
    function getLeaderboard(uint256 _offset, uint256 _limit) public view returns (LeaderboardEntry[] memory) {
        uint256 totalPlayers = allPlayers.length;

        if (_offset >= totalPlayers) {
            return new LeaderboardEntry[](0);
        }

        uint256 endIndex = _offset + _limit;
        if (endIndex > totalPlayers) {
            endIndex = totalPlayers;
        }

        uint256 resultLength = endIndex - _offset;
        LeaderboardEntry[] memory result = new LeaderboardEntry[](resultLength);

        // Create a temporary array to sort by best scores
        LeaderboardEntry[] memory allEntries = new LeaderboardEntry[](totalPlayers);
        for (uint256 i = 0; i < totalPlayers; i++) {
            address player = allPlayers[i];
            allEntries[i] = LeaderboardEntry({
                score: playerBestScore[player],
                playerName: playerNames[player],
                playerAddress: player
            });
        }

        // Sort by score (descending) - simple bubble sort for small arrays
        for (uint256 i = 0; i < totalPlayers - 1; i++) {
            for (uint256 j = 0; j < totalPlayers - i - 1; j++) {
                if (allEntries[j].score < allEntries[j + 1].score) {
                    LeaderboardEntry memory temp = allEntries[j];
                    allEntries[j] = allEntries[j + 1];
                    allEntries[j + 1] = temp;
                }
            }
        }

        // Copy the requested range
        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = allEntries[_offset + i];
        }

        return result;
    }

    /**
     * @dev Gets the total number of players in the leaderboard
     * @return Total number of players
     */
    function getTotalScores() public view returns (uint256) {
        return allPlayers.length;
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