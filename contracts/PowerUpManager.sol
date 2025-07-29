// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IRICEManager {
    function spendRICEEmergencyForPowerUp(
        address player,
        uint256 amount,
        bytes32 operationHash
    ) external;
}

contract PowerUpManager {
    // ================================
    // STORAGE
    // ================================
    mapping(address => mapping(uint256 => uint256)) public levels; // player => powerUpId => level
    mapping(uint256 => uint256) public powerUpBaseCosts; // powerUpId => base cost
    mapping(uint256 => uint256) public powerUpMaxLevels; // powerUpId => max level
    mapping(uint256 => mapping(uint256 => uint256)) public powerUpLevelCosts; // powerUpId => level => cost

    // Security and ownership
    address public gameOwner; // Address autorisée à gérer le contrat
    bool public paused = false;

    // Security key for signing operations (set by game owner)
    bytes32 public securityKey;
    bool public securityKeySet = false;

    // Contract addresses
    address public riceManager;
    address public gameServer;

    // Anti-spam protection
    mapping(address => uint256) public lastUpgradeTimestamp;
    uint256 public constant MIN_TIME_BETWEEN_UPGRADES = 30 seconds;

    // Prevent upgrade reuse
    mapping(bytes32 => bool) public usedUpgradeHashes;

    // Events
    event PowerUpUpgraded(
        address indexed player,
        uint256 indexed powerUpId,
        uint256 oldLevel,
        uint256 newLevel,
        uint256 cost,
        bytes32 upgradeHash
    );
    event PowerUpConfigured(
        uint256 indexed powerUpId,
        uint256 baseCost,
        uint256 maxLevel
    );
    event GameOwnerUpdated(address indexed oldOwner, address indexed newOwner);
    event ContractPaused(bool paused);
    event GameServerUpdated(
        address indexed oldServer,
        address indexed newServer
    );

    modifier onlyGameOwner() {
        require(
            msg.sender == gameOwner,
            "Only game owner can call this function"
        );
        _;
    }

    modifier onlyGameServer() {
        require(msg.sender == gameServer, "Not authorized");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    constructor(address _riceManager, address _gameServer) {
        gameOwner = msg.sender;
        riceManager = _riceManager;
        gameServer = _gameServer;
    }

    /**
     * @dev Sets the security key for signing operations
     * @param _securityKey The security key to set
     */
    function setSecurityKey(bytes32 _securityKey) external onlyGameOwner {
        securityKey = _securityKey;
        securityKeySet = true;
    }

    /**
     * @dev Updates the game owner
     * @param _newOwner The new game owner address
     */
    function setGameOwner(address _newOwner) external onlyGameOwner {
        require(_newOwner != address(0), "Invalid address");
        address oldOwner = gameOwner;
        gameOwner = _newOwner;
        emit GameOwnerUpdated(oldOwner, _newOwner);
    }

    /**
     * @dev Pauses or unpauses the contract
     * @param _paused True to pause, false to unpause
     */
    function setPaused(bool _paused) external onlyGameOwner {
        paused = _paused;
        emit ContractPaused(_paused);
    }

    /**
     * @dev Updates the game server address
     * @param _gameServer The new game server address
     */
    function setGameServer(address _gameServer) external onlyGameOwner {
        require(_gameServer != address(0), "Invalid address");
        address oldServer = gameServer;
        gameServer = _gameServer;
        emit GameServerUpdated(oldServer, _gameServer);
    }

    /**
     * @dev Updates the RICEManager address
     * @param _riceManager The new RICEManager address
     */
    function setRiceManager(address _riceManager) external onlyGameOwner {
        require(_riceManager != address(0), "Invalid address");
        riceManager = _riceManager;
    }

    /// @notice Set base cost and max level of a power-up (on-chain)
    function setPowerUp(
        uint256 powerUpId,
        uint256 baseCost,
        uint256 maxLevel
    ) external onlyGameServer whenNotPaused {
        require(baseCost > 0, "Base cost must be greater than 0");
        require(maxLevel > 0, "Max level must be greater than 0");

        powerUpBaseCosts[powerUpId] = baseCost;
        powerUpMaxLevels[powerUpId] = maxLevel;

        // Initialize level costs with a progression
        for (uint256 level = 1; level <= maxLevel; level++) {
            powerUpLevelCosts[powerUpId][level] = baseCost * level * level; // Quadratic progression
        }

        emit PowerUpConfigured(powerUpId, baseCost, maxLevel);
    }

    /// @notice Upgrade power-up with signature verification
    function upgradePowerUp(
        address player,
        uint256 powerUpId,
        bytes32 upgradeHash,
        bytes memory signature
    ) external whenNotPaused {
        require(!usedUpgradeHashes[upgradeHash], "Upgrade hash already used");
        require(
            block.timestamp >=
                lastUpgradeTimestamp[player] + MIN_TIME_BETWEEN_UPGRADES,
            "Too soon since last upgrade"
        );
        require(securityKeySet, "Security key not set");

        uint256 currentLevel = levels[player][powerUpId];
        uint256 maxLevel = powerUpMaxLevels[powerUpId];
        require(maxLevel > 0, "Power-up not initialized");
        require(currentLevel < maxLevel, "Already max level");

        uint256 cost = powerUpLevelCosts[powerUpId][currentLevel + 1];

        // Verify the signature
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                "UPGRADE_POWERUP",
                player,
                powerUpId,
                cost,
                upgradeHash
            )
        );
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        // Recover the signer from the signature
        address signer = recoverSigner(ethSignedMessageHash, signature);

        // The signer should be the game owner (who has the security key)
        require(signer == gameOwner, "Invalid signature");

        // Mark hash as used
        usedUpgradeHashes[upgradeHash] = true;
        lastUpgradeTimestamp[player] = block.timestamp;

        // Spend RICE and upgrade (now using RICE units, not wei)
        IRICEManager(riceManager).spendRICEEmergencyForPowerUp(
            player,
            cost, // Cost in RICE units, not wei
            bytes32(0)
        );
        levels[player][powerUpId]++;

        emit PowerUpUpgraded(
            player,
            powerUpId,
            currentLevel,
            levels[player][powerUpId],
            cost,
            upgradeHash
        );
    }

    /// @notice Emergency function to set power-up without signature (for testing)
    function setPowerUpEmergency(
        uint256 powerUpId,
        uint256 baseCost,
        uint256 maxLevel
    ) external onlyGameOwner whenNotPaused {
        require(baseCost > 0, "Base cost must be greater than 0");
        require(maxLevel > 0, "Max level must be greater than 0");

        powerUpBaseCosts[powerUpId] = baseCost;
        powerUpMaxLevels[powerUpId] = maxLevel;

        // Initialize level costs with a progression
        for (uint256 level = 1; level <= maxLevel; level++) {
            powerUpLevelCosts[powerUpId][level] = baseCost * level * level; // Quadratic progression
        }

        emit PowerUpConfigured(powerUpId, baseCost, maxLevel);
    }

    /// @notice Emergency function to upgrade power-up without signature (for testing)
    function upgradePowerUpEmergency(
        address player,
        uint256 powerUpId
    ) external whenNotPaused {
        uint256 currentLevel = levels[player][powerUpId];
        uint256 maxLevel = powerUpMaxLevels[powerUpId];
        require(maxLevel > 0, "Power-up not initialized");
        require(currentLevel < maxLevel, "Already max level");

        uint256 cost = powerUpLevelCosts[powerUpId][currentLevel + 1];

        IRICEManager(riceManager).spendRICEEmergencyForPowerUp(
            player,
            cost, // Convert RICE to wei
            bytes32(0)
        );
        levels[player][powerUpId]++;

        emit PowerUpUpgraded(
            player,
            powerUpId,
            currentLevel,
            levels[player][powerUpId],
            cost,
            bytes32(0)
        );
    }

    /// @notice Return levels of the 10 first power-ups for a player
    function getPowerUpLevels(
        address player
    ) external view returns (uint256[] memory) {
        uint256 count = 10;
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            // Return level + 1 so players start at level 1 instead of 0
            result[i] = levels[player][i] + 1;
        }
        return result;
    }

    /// @notice Return base cost and maxLevel of a power-up
    function getPowerUpConfig(
        uint256 powerUpId
    ) external view returns (uint256 baseCost, uint256 maxLevel) {
        return (powerUpBaseCosts[powerUpId], powerUpMaxLevels[powerUpId]);
    }

    /// @notice Get the cost to upgrade to a specific level
    function getPowerUpLevelCost(
        uint256 powerUpId,
        uint256 level
    ) external view returns (uint256 cost) {
        return powerUpLevelCosts[powerUpId][level];
    }

    /// @notice Get the cost to upgrade the next level for a player
    function getPowerUpUpgradeCost(
        address player,
        uint256 powerUpId
    ) external view returns (uint256 cost) {
        uint256 currentLevel = levels[player][powerUpId];
        // Calculate cost for the next level (currentLevel + 1)
        return powerUpLevelCosts[powerUpId][currentLevel + 1];
    }

    /**
     * @dev Recovers the signer from a signature
     */
    function recoverSigner(
        bytes32 _ethSignedMessageHash,
        bytes memory _signature
    ) internal pure returns (address) {
        require(_signature.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }

        if (v < 27) {
            v += 27;
        }

        require(v == 27 || v == 28, "Invalid signature 'v' value");

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    /// @notice Get contract information
    function getContractInfo()
        external
        view
        returns (
            address _gameOwner,
            bool _paused,
            uint256 _minTimeBetweenUpgrades,
            bool _securityKeySet
        )
    {
        return (gameOwner, paused, MIN_TIME_BETWEEN_UPGRADES, securityKeySet);
    }
}
