// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IRICEManager.sol";

/**
 * @title RICEManager
 * @dev Manages RICE token balances and operations with signature verification
 * Implements IRICEManager interface for modularity
 */
contract RICEManager is IRICEManager {
    mapping(address => uint256) public balances;

    // Security and ownership
    address public gameOwner; // Address authorized to manage the contract
    bool public paused = false;

    // Security key for signing operations (set by game owner)
    bytes32 public securityKey;
    bool public securityKeySet = false;

    // ScoreBoard contract address (set by game owner)
    address public scoreBoardAddress;

    // Anti-spam protection
    mapping(address => uint256) public lastOperationTimestamp;
    uint256 public constant MIN_TIME_BETWEEN_OPERATIONS = 30 seconds;

    // Prevent operation reuse
    mapping(bytes32 => bool) public usedOperationHashes;

    // Contract addresses
    address public powerUpManagerAddress;

    // Daily reveal tracking
    mapping(address => uint256) public lastDailyRevealTimestamp;
    uint256 public constant DAILY_REVEAL_COOLDOWN = 24 hours;

    // Events are now defined in the interface

    modifier onlyGameOwner() {
        require(
            msg.sender == gameOwner,
            "Only game owner can call this function"
        );
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    modifier onlyScoreBoard() {
        require(
            msg.sender == scoreBoardAddress,
            "Only ScoreBoard can call this function"
        );
        _;
    }

    modifier onlyPowerUpManager() {
        require(
            msg.sender == powerUpManagerAddress,
            "Only PowerUpManager can call this function"
        );
        _;
    }

    constructor() {
        gameOwner = msg.sender;
    }

    /**
     * @dev Adds RICE to a player's balance with signature verification
     * @param player The player's address
     * @param amount The amount of RICE to add (in RICE units, not wei)
     * @param operationHash Unique operation hash to verify authenticity
     * @param signature Signature created with the security key
     */
    function addRICE(
        address player,
        uint256 amount,
        bytes32 operationHash,
        bytes memory signature
    ) external whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(
            !usedOperationHashes[operationHash],
            "Operation hash already used"
        );
        require(
            block.timestamp >=
                lastOperationTimestamp[player] + MIN_TIME_BETWEEN_OPERATIONS,
            "Too soon since last operation"
        );
        require(securityKeySet, "Security key not set");

        // Verify the signature
        bytes32 messageHash = keccak256(
            abi.encodePacked("ADD_RICE", player, amount, operationHash)
        );
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        // Recover the signer from the signature
        address signer = recoverSigner(ethSignedMessageHash, signature);

        // The signer should be the game owner (who has the security key)
        require(signer == gameOwner, "Invalid signature");

        // Mark hash as used
        usedOperationHashes[operationHash] = true;
        lastOperationTimestamp[player] = block.timestamp;

        balances[player] += amount;
        emit RICEAdded(player, amount, operationHash);
    }

    /**
     * @dev Adds RICE from daily reveal with signature verification
     * @param player The player's address
     * @param amount The amount of RICE to add (in RICE units, not wei)
     * @param operationHash Unique operation hash to verify authenticity
     * @param signature Signature created with the security key
     */
    function addDailyRevealRICE(
        address player,
        uint256 amount,
        bytes32 operationHash,
        bytes memory signature
    ) external whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(
            !usedOperationHashes[operationHash],
            "Operation hash already used"
        );
        require(
            block.timestamp >=
                lastDailyRevealTimestamp[player] + DAILY_REVEAL_COOLDOWN,
            "Daily reveal already claimed today"
        );
        require(securityKeySet, "Security key not set");

        // Verify the signature
        bytes32 messageHash = keccak256(
            abi.encodePacked("DAILY_REVEAL_RICE", player, amount, operationHash)
        );
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        // Recover the signer from the signature
        address signer = recoverSigner(ethSignedMessageHash, signature);

        // The signer should be the game owner (who has the security key)
        require(signer == gameOwner, "Invalid signature");

        // Mark hash as used
        usedOperationHashes[operationHash] = true;
        lastDailyRevealTimestamp[player] = block.timestamp;

        balances[player] += amount;
        emit DailyRevealRICEAdded(player, amount, operationHash);
    }

    /**
     * @dev Spends RICE from a player's balance with signature verification
     * @param player The player's address
     * @param amount The amount of RICE to spend (in RICE units, not wei)
     * @param operationHash Unique operation hash to verify authenticity
     * @param signature Signature created with the security key
     */
    function spendRICE(
        address player,
        uint256 amount,
        bytes32 operationHash,
        bytes memory signature
    ) external whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(balances[player] >= amount, "Not enough RICE");
        require(
            !usedOperationHashes[operationHash],
            "Operation hash already used"
        );
        require(
            block.timestamp >=
                lastOperationTimestamp[player] + MIN_TIME_BETWEEN_OPERATIONS,
            "Too soon since last operation"
        );
        require(securityKeySet, "Security key not set");

        // Verify the signature
        bytes32 messageHash = keccak256(
            abi.encodePacked("SPEND_RICE", player, amount, operationHash)
        );
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        // Recover the signer from the signature
        address signer = recoverSigner(ethSignedMessageHash, signature);

        // The signer should be the game owner (who has the security key)
        require(signer == gameOwner, "Invalid signature");

        // Mark hash as used
        usedOperationHashes[operationHash] = true;
        lastOperationTimestamp[player] = block.timestamp;

        balances[player] -= amount;
        emit RICESpent(player, amount, operationHash);
    }

    /**
     * @dev Emergency function to add RICE without signature (for testing)
     * Only accessible by the ScoreBoard contract
     * @param player The player's address
     * @param amount The amount of RICE to add (in RICE units, not wei)
     * @param operationHash Unique operation hash
     */
    function addRICEEmergency(
        address player,
        uint256 amount,
        bytes32 operationHash
    ) external onlyScoreBoard whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(
            !usedOperationHashes[operationHash],
            "Operation hash already used"
        );

        usedOperationHashes[operationHash] = true;
        balances[player] += amount;
        emit RICEAdded(player, amount, operationHash);
    }

    /**
     * @dev Emergency function to spend RICE without signature (for testing)
     * Only accessible by the game owner
     * @param player The player's address
     * @param amount The amount of RICE to spend (in RICE units, not wei)
     * @param operationHash Unique operation hash
     */
    function spendRICEEmergency(
        address player,
        uint256 amount,
        bytes32 operationHash
    ) external onlyGameOwner whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(balances[player] >= amount, "Not enough RICE");
        require(
            !usedOperationHashes[operationHash],
            "Operation hash already used"
        );

        usedOperationHashes[operationHash] = true;
        balances[player] -= amount;
        emit RICESpent(player, amount, operationHash);
    }

    /**
     * @dev Emergency function to spend RICE for PowerUpManager without signature
     * Only accessible by the PowerUpManager contract
     * @param player The player's address
     * @param amount The amount of RICE to spend (in RICE units, not wei)
     * @param operationHash Unique operation hash
     */
    function spendRICEEmergencyForPowerUp(
        address player,
        uint256 amount,
        bytes32 operationHash
    ) external onlyPowerUpManager whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(balances[player] >= amount, "Not enough RICE");
        require(
            !usedOperationHashes[operationHash],
            "Operation hash already used"
        );

        usedOperationHashes[operationHash] = true;
        balances[player] -= amount;
        emit RICESpent(player, amount, operationHash);
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

    /**
     * @dev Gets the RICE balance for a player (in RICE units, not wei)
     * @param player The player's address
     * @return The player's RICE balance
     */
    function getBalance(address player) external view returns (uint256) {
        return balances[player];
    }

    /**
     * @dev Checks if player can claim daily reveal
     * @param player The player's address
     * @return True if player can claim daily reveal
     */
    function canClaimDailyReveal(address player) external view returns (bool) {
        return
            block.timestamp >=
            lastDailyRevealTimestamp[player] + DAILY_REVEAL_COOLDOWN;
    }

    /**
     * @dev Gets the time until next daily reveal can be claimed
     * @param player The player's address
     * @return Time in seconds until next claim
     */
    function getTimeUntilNextDailyReveal(
        address player
    ) external view returns (uint256) {
        uint256 nextClaimTime = lastDailyRevealTimestamp[player] +
            DAILY_REVEAL_COOLDOWN;
        if (block.timestamp >= nextClaimTime) {
            return 0;
        }
        return nextClaimTime - block.timestamp;
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

    /**
     * @dev Sets the security key for signing operations
     * @param _securityKey The new security key
     */
    function setSecurityKey(bytes32 _securityKey) public onlyGameOwner {
        securityKey = _securityKey;
        securityKeySet = true;
        emit SecurityKeyUpdated(_securityKey);
    }

    /**
     * @dev Sets the ScoreBoard contract address
     * @param _scoreBoardAddress The ScoreBoard contract address
     */
    function setScoreBoardAddress(
        address _scoreBoardAddress
    ) public onlyGameOwner {
        require(_scoreBoardAddress != address(0), "Invalid address");
        scoreBoardAddress = _scoreBoardAddress;
        emit ScoreBoardAddressUpdated(_scoreBoardAddress);
    }

    /**
     * @dev Sets the PowerUpManager contract address
     * @param _powerUpManagerAddress The PowerUpManager contract address
     */
    function setPowerUpManagerAddress(
        address _powerUpManagerAddress
    ) public onlyGameOwner {
        require(_powerUpManagerAddress != address(0), "Invalid address");
        powerUpManagerAddress = _powerUpManagerAddress;
        emit PowerUpManagerAddressUpdated(_powerUpManagerAddress);
    }

    function getContractInfo()
        public
        view
        returns (
            address _gameOwner,
            bool _paused,
            uint256 _minTimeBetweenOperations,
            bool _securityKeySet,
            uint256 _dailyRevealCooldown
        )
    {
        return (
            gameOwner,
            paused,
            MIN_TIME_BETWEEN_OPERATIONS,
            securityKeySet,
            DAILY_REVEAL_COOLDOWN
        );
    }
}
