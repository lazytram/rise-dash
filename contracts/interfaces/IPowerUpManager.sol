// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IPowerUpManager
 * @dev Interface for PowerUpManager contract
 * Provides functions for managing power-up upgrades and configurations
 */
interface IPowerUpManager {
    // ================================
    // EVENTS
    // ================================
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
    event RICEManagerUpdated(
        address indexed oldManager,
        address indexed newManager
    );

    // ================================
    // VIEW FUNCTIONS
    // ================================

    /**
     * @dev Returns levels of the first 10 power-ups for a player
     * @param player The player's address
     * @return Array of power-up levels (1-indexed)
     */
    function getPowerUpLevels(
        address player
    ) external view returns (uint256[] memory);

    /**
     * @dev Returns base cost and maxLevel of a power-up
     * @param powerUpId The power-up ID
     * @return baseCost The base cost of the power-up
     * @return maxLevel The maximum level of the power-up
     */
    function getPowerUpConfig(
        uint256 powerUpId
    ) external view returns (uint256 baseCost, uint256 maxLevel);

    /**
     * @dev Gets the cost to upgrade to a specific level
     * @param powerUpId The power-up ID
     * @param level The target level
     * @return cost The cost to upgrade to that level
     */
    function getPowerUpLevelCost(
        uint256 powerUpId,
        uint256 level
    ) external view returns (uint256 cost);

    /**
     * @dev Gets the cost to upgrade the next level for a player
     * @param player The player's address
     * @param powerUpId The power-up ID
     * @return cost The cost to upgrade to the next level
     */
    function getPowerUpUpgradeCost(
        address player,
        uint256 powerUpId
    ) external view returns (uint256 cost);

    /**
     * @dev Gets contract information
     * @return _gameOwner The game owner address
     * @return _paused Whether the contract is paused
     * @return _minTimeBetweenUpgrades Minimum time between upgrades
     * @return _securityKeySet Whether security key is set
     */
    function getContractInfo()
        external
        view
        returns (
            address _gameOwner,
            bool _paused,
            uint256 _minTimeBetweenUpgrades,
            bool _securityKeySet
        );

    // ================================
    // STATE-CHANGING FUNCTIONS
    // ================================

    /**
     * @dev Sets base cost and max level of a power-up (on-chain)
     * @param powerUpId The power-up ID
     * @param baseCost The base cost
     * @param maxLevel The maximum level
     */
    function setPowerUp(
        uint256 powerUpId,
        uint256 baseCost,
        uint256 maxLevel
    ) external;

    /**
     * @dev Upgrades power-up with signature verification
     * @param player The player's address
     * @param powerUpId The power-up ID
     * @param upgradeHash Unique upgrade hash to verify authenticity
     * @param signature Signature created with the security key
     */
    function upgradePowerUp(
        address player,
        uint256 powerUpId,
        bytes32 upgradeHash,
        bytes memory signature
    ) external;

    /**
     * @dev Emergency function to set power-up without signature (for testing)
     * @param powerUpId The power-up ID
     * @param baseCost The base cost
     * @param maxLevel The maximum level
     */
    function setPowerUpEmergency(
        uint256 powerUpId,
        uint256 baseCost,
        uint256 maxLevel
    ) external;

    /**
     * @dev Emergency function to upgrade power-up without signature (for testing)
     * @param player The player's address
     * @param powerUpId The power-up ID
     */
    function upgradePowerUpEmergency(
        address player,
        uint256 powerUpId
    ) external;

    // ================================
    // ADMIN FUNCTIONS
    // ================================

    /**
     * @dev Sets the security key for signing operations
     * @param _securityKey The security key to set
     */
    function setSecurityKey(bytes32 _securityKey) external;

    /**
     * @dev Updates the game owner
     * @param _newOwner The new game owner address
     */
    function setGameOwner(address _newOwner) external;

    /**
     * @dev Pauses or unpauses the contract
     * @param _paused True to pause, false to unpause
     */
    function setPaused(bool _paused) external;

    /**
     * @dev Updates the game server address
     * @param _gameServer The new game server address
     */
    function setGameServer(address _gameServer) external;

    /**
     * @dev Updates the RICEManager address
     * @param _riceManager The new RICEManager address
     */
    function setRiceManager(address _riceManager) external;
}
