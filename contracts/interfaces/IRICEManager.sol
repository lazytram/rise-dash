// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IRICEManager
 * @dev Interface for RICEManager contract
 * Provides functions for managing RICE token balances and operations
 */
interface IRICEManager {
    // ================================
    // EVENTS
    // ================================
    event RICEAdded(
        address indexed player,
        uint256 amount,
        bytes32 operationHash
    );
    event RICESpent(
        address indexed player,
        uint256 amount,
        bytes32 operationHash
    );
    event DailyRevealRICEAdded(
        address indexed player,
        uint256 amount,
        bytes32 operationHash
    );
    event GameOwnerUpdated(address indexed oldOwner, address indexed newOwner);
    event ContractPaused(bool paused);
    event SecurityKeyUpdated(bytes32 newKey);
    event ScoreBoardAddressUpdated(address indexed newAddress);
    event PowerUpManagerAddressUpdated(address indexed newAddress);

    // ================================
    // VIEW FUNCTIONS
    // ================================

    /**
     * @dev Gets the RICE balance for a player
     * @param player The player's address
     * @return The player's RICE balance
     */
    function getBalance(address player) external view returns (uint256);

    /**
     * @dev Checks if player can claim daily reveal
     * @param player The player's address
     * @return True if player can claim daily reveal
     */
    function canClaimDailyReveal(address player) external view returns (bool);

    /**
     * @dev Gets the time until next daily reveal can be claimed
     * @param player The player's address
     * @return Time in seconds until next claim
     */
    function getTimeUntilNextDailyReveal(
        address player
    ) external view returns (uint256);

    /**
     * @dev Gets contract information
     * @return _gameOwner The game owner address
     * @return _paused Whether the contract is paused
     * @return _minTimeBetweenOperations Minimum time between operations
     * @return _securityKeySet Whether security key is set
     * @return _dailyRevealCooldown Daily reveal cooldown period
     */
    function getContractInfo()
        external
        view
        returns (
            address _gameOwner,
            bool _paused,
            uint256 _minTimeBetweenOperations,
            bool _securityKeySet,
            uint256 _dailyRevealCooldown
        );

    // ================================
    // STATE-CHANGING FUNCTIONS
    // ================================

    /**
     * @dev Adds RICE to a player's balance with signature verification
     * @param player The player's address
     * @param amount The amount of RICE to add
     * @param operationHash Unique operation hash to verify authenticity
     * @param signature Signature created with the security key
     */
    function addRICE(
        address player,
        uint256 amount,
        bytes32 operationHash,
        bytes memory signature
    ) external;

    /**
     * @dev Adds RICE from daily reveal with signature verification
     * @param player The player's address
     * @param amount The amount of RICE to add
     * @param operationHash Unique operation hash to verify authenticity
     * @param signature Signature created with the security key
     */
    function addDailyRevealRICE(
        address player,
        uint256 amount,
        bytes32 operationHash,
        bytes memory signature
    ) external;

    /**
     * @dev Spends RICE from a player's balance with signature verification
     * @param player The player's address
     * @param amount The amount of RICE to spend
     * @param operationHash Unique operation hash to verify authenticity
     * @param signature Signature created with the security key
     */
    function spendRICE(
        address player,
        uint256 amount,
        bytes32 operationHash,
        bytes memory signature
    ) external;

    /**
     * @dev Emergency function to add RICE without signature (for authorized contracts)
     * @param player The player's address
     * @param amount The amount of RICE to add
     * @param operationHash Unique operation hash
     */
    function addRICEEmergency(
        address player,
        uint256 amount,
        bytes32 operationHash
    ) external;

    /**
     * @dev Emergency function to spend RICE without signature (for authorized contracts)
     * @param player The player's address
     * @param amount The amount of RICE to spend
     * @param operationHash Unique operation hash
     */
    function spendRICEEmergency(
        address player,
        uint256 amount,
        bytes32 operationHash
    ) external;

    /**
     * @dev Emergency function to spend RICE for PowerUpManager without signature
     * @param player The player's address
     * @param amount The amount of RICE to spend
     * @param operationHash Unique operation hash
     */
    function spendRICEEmergencyForPowerUp(
        address player,
        uint256 amount,
        bytes32 operationHash
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
     * @dev Sets the security key for signing operations
     * @param _securityKey The new security key
     */
    function setSecurityKey(bytes32 _securityKey) external;

    /**
     * @dev Sets the ScoreBoard contract address
     * @param _scoreBoardAddress The ScoreBoard contract address
     */
    function setScoreBoardAddress(address _scoreBoardAddress) external;

    /**
     * @dev Sets the PowerUpManager contract address
     * @param _powerUpManagerAddress The PowerUpManager contract address
     */
    function setPowerUpManagerAddress(address _powerUpManagerAddress) external;
}
