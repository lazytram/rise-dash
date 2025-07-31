// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IRICEManager.sol";
import "./interfaces/IScoreBoard.sol";
import "./interfaces/IPowerUpManager.sol";

/**
 * @title GameRegistry
 * @dev Central registry for managing game contract addresses and admin controls
 * Provides a single point of truth for contract addresses and admin functions
 */
contract GameRegistry {
    // ================================
    // STORAGE
    // ================================

    // Contract addresses
    address public riceManager;
    address public scoreBoard;
    address public powerUpManager;

    // Admin controls
    address public gameOwner;
    address public gameServer;
    bool public paused = false;

    // Role-based access control
    mapping(address => bool) public authorizedContracts;
    mapping(address => bool) public authorizedAdmins;

    // ================================
    // EVENTS
    // ================================
    event ContractAddressUpdated(string contractName, address oldAddress, address newAddress);
    event GameOwnerUpdated(address indexed oldOwner, address indexed newOwner);
    event GameServerUpdated(address indexed oldServer, address indexed newServer);
    event ContractPaused(bool paused);
    event AuthorizedContractUpdated(address indexed contractAddress, bool authorized);
    event AuthorizedAdminUpdated(address indexed admin, bool authorized);

    // ================================
    // MODIFIERS
    // ================================

    modifier onlyGameOwner() {
        require(msg.sender == gameOwner, "Only game owner can call this function");
        _;
    }

    modifier onlyAuthorizedAdmin() {
        require(
            msg.sender == gameOwner || authorizedAdmins[msg.sender],
            "Only authorized admin can call this function"
        );
        _;
    }

    modifier onlyAuthorizedContract() {
        require(
            authorizedContracts[msg.sender],
            "Only authorized contract can call this function"
        );
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Registry is paused");
        _;
    }

    // ================================
    // CONSTRUCTOR
    // ================================

    constructor() {
        gameOwner = msg.sender;
        authorizedAdmins[msg.sender] = true;
    }

    // ================================
    // VIEW FUNCTIONS
    // ================================

    /**
     * @dev Gets all contract addresses
     * @return _riceManager RICEManager address
     * @return _scoreBoard ScoreBoard address
     * @return _powerUpManager PowerUpManager address
     */
    function getContractAddresses() external view returns (
        address _riceManager,
        address _scoreBoard,
        address _powerUpManager
    ) {
        return (riceManager, scoreBoard, powerUpManager);
    }

    /**
     * @dev Gets admin information
     * @return _gameOwner Game owner address
     * @return _gameServer Game server address
     * @return _paused Whether registry is paused
     */
    function getAdminInfo() external view returns (
        address _gameOwner,
        address _gameServer,
        bool _paused
    ) {
        return (gameOwner, gameServer, _paused);
    }

    /**
     * @dev Checks if an address is an authorized contract
     * @param _contract The contract address to check
     * @return True if authorized
     */
    function isAuthorizedContract(address _contract) external view returns (bool) {
        return authorizedContracts[_contract];
    }

    /**
     * @dev Checks if an address is an authorized admin
     * @param _admin The admin address to check
     * @return True if authorized
     */
    function isAuthorizedAdmin(address _admin) external view returns (bool) {
        return _admin == gameOwner || authorizedAdmins[_admin];
    }

    // ================================
    // ADMIN FUNCTIONS
    // ================================

    /**
     * @dev Sets the RICEManager contract address
     * @param _riceManager The new RICEManager address
     */
    function setRICEManager(address _riceManager) external onlyAuthorizedAdmin whenNotPaused {
        require(_riceManager != address(0), "Invalid address");
        address oldAddress = riceManager;
        riceManager = _riceManager;
        authorizedContracts[_riceManager] = true;
        emit ContractAddressUpdated("RICEManager", oldAddress, _riceManager);
    }

    /**
     * @dev Sets the ScoreBoard contract address
     * @param _scoreBoard The new ScoreBoard address
     */
    function setScoreBoard(address _scoreBoard) external onlyAuthorizedAdmin whenNotPaused {
        require(_scoreBoard != address(0), "Invalid address");
        address oldAddress = scoreBoard;
        scoreBoard = _scoreBoard;
        authorizedContracts[_scoreBoard] = true;
        emit ContractAddressUpdated("ScoreBoard", oldAddress, _scoreBoard);
    }

    /**
     * @dev Sets the PowerUpManager contract address
     * @param _powerUpManager The new PowerUpManager address
     */
    function setPowerUpManager(address _powerUpManager) external onlyAuthorizedAdmin whenNotPaused {
        require(_powerUpManager != address(0), "Invalid address");
        address oldAddress = powerUpManager;
        powerUpManager = _powerUpManager;
        authorizedContracts[_powerUpManager] = true;
        emit ContractAddressUpdated("PowerUpManager", oldAddress, _powerUpManager);
    }

    /**
     * @dev Sets the game server address
     * @param _gameServer The new game server address
     */
    function setGameServer(address _gameServer) external onlyAuthorizedAdmin whenNotPaused {
        require(_gameServer != address(0), "Invalid address");
        address oldServer = gameServer;
        gameServer = _gameServer;
        emit GameServerUpdated(oldServer, _gameServer);
    }

    /**
     * @dev Updates the game owner
     * @param _newOwner The new game owner address
     */
    function setGameOwner(address _newOwner) external onlyGameOwner {
        require(_newOwner != address(0), "Invalid address");
        address oldOwner = gameOwner;
        gameOwner = _newOwner;
        authorizedAdmins[_newOwner] = true;
        emit GameOwnerUpdated(oldOwner, _newOwner);
    }

    /**
     * @dev Pauses or unpauses the registry
     * @param _paused True to pause, false to unpause
     */
    function setPaused(bool _paused) external onlyAuthorizedAdmin {
        paused = _paused;
        emit ContractPaused(_paused);
    }

    /**
     * @dev Authorizes or deauthorizes a contract
     * @param _contract The contract address
     * @param _authorized True to authorize, false to deauthorize
     */
    function setAuthorizedContract(address _contract, bool _authorized) external onlyAuthorizedAdmin {
        authorizedContracts[_contract] = _authorized;
        emit AuthorizedContractUpdated(_contract, _authorized);
    }

    /**
     * @dev Authorizes or deauthorizes an admin
     * @param _admin The admin address
     * @param _authorized True to authorize, false to deauthorize
     */
    function setAuthorizedAdmin(address _admin, bool _authorized) external onlyGameOwner {
        authorizedAdmins[_admin] = _authorized;
        emit AuthorizedAdminUpdated(_admin, _authorized);
    }

    // ================================
    // CONTRACT INTERFACE FUNCTIONS
    // ================================

    /**
     * @dev Gets RICE balance for a player via RICEManager
     * @param _player The player's address
     * @return The player's RICE balance
     */
    function getRICEBalance(address _player) external view returns (uint256) {
        require(riceManager != address(0), "RICEManager not set");
        return IRICEManager(riceManager).getBalance(_player);
    }

    /**
     * @dev Gets player's best score via ScoreBoard
     * @param _player The player's address
     * @return The player's best score
     */
    function getPlayerBestScore(address _player) external view returns (uint256) {
        require(scoreBoard != address(0), "ScoreBoard not set");
        return IScoreBoard(scoreBoard).getPlayerBestScore(_player);
    }

    /**
     * @dev Gets player's power-up levels via PowerUpManager
     * @param _player The player's address
     * @return Array of power-up levels
     */
    function getPowerUpLevels(address _player) external view returns (uint256[] memory) {
        require(powerUpManager != address(0), "PowerUpManager not set");
        return IPowerUpManager(powerUpManager).getPowerUpLevels(_player);
    }

    /**
     * @dev Gets leaderboard via ScoreBoard
     * @param _offset Starting index for pagination
     * @param _limit Number of entries to return
     * @return Array of leaderboard entries
     */
    function getLeaderboard(uint256 _offset, uint256 _limit) external view returns (IScoreBoard.LeaderboardEntry[] memory) {
        require(scoreBoard != address(0), "ScoreBoard not set");
        return IScoreBoard(scoreBoard).getLeaderboard(_offset, _limit);
    }
}