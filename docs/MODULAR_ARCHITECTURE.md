# Modular Architecture Documentation

## Overview

This document describes the enhanced modular architecture for the Rise Dash game contracts, implementing better security, modularity, and admin controls based on best practices from [Solidity by Example](https://solidity-by-example.org/interface/) and the [Yearn tokenized strategy template](https://github.com/yearn/tokenized-strategy-foundry-mix).

## Architecture Components

### 1. Interface Contracts

#### `IRICEManager.sol`

- **Purpose**: Defines the interface for RICE token management
- **Key Functions**:
  - `addRICE()` - Add RICE with signature verification
  - `spendRICE()` - Spend RICE with signature verification
  - `getBalance()` - Get player's RICE balance
  - `canClaimDailyReveal()` - Check daily reveal eligibility

#### `IScoreBoard.sol`

- **Purpose**: Defines the interface for score management and leaderboards
- **Key Functions**:
  - `recordScore()` - Record score with signature verification
  - `recordScoreWithRICE()` - Record score and add RICE rewards
  - `getLeaderboard()` - Get paginated leaderboard
  - `getPlayerBestScore()` - Get player's best score

#### `IPowerUpManager.sol`

- **Purpose**: Defines the interface for power-up management
- **Key Functions**:
  - `upgradePowerUp()` - Upgrade power-up with signature verification
  - `getPowerUpLevels()` - Get player's power-up levels
  - `getPowerUpUpgradeCost()` - Get upgrade cost for next level

### 2. Core Contracts

#### `RICEManager.sol`

- **Implements**: `IRICEManager`
- **Features**:
  - Signature-based RICE operations
  - Anti-spam protection
  - Daily reveal cooldown
  - Emergency functions for authorized contracts

#### `ScoreBoard.sol`

- **Implements**: `IScoreBoard`
- **Features**:
  - Score recording with signature verification
  - Global leaderboard management
  - RICE reward integration
  - Player name tracking

#### `PowerUpManager.sol`

- **Implements**: `IPowerUpManager`
- **Features**:
  - Power-up level management
  - Quadratic cost progression
  - Signature-based upgrades
  - RICE integration for purchases

### 3. Admin & Registry Contracts

#### `GameRegistry.sol`

- **Purpose**: Central registry for contract addresses and admin functions
- **Features**:
  - Contract address management
  - Role-based access control
  - Unified interface for contract interactions
  - Admin function delegation

#### `AdminController.sol`

- **Purpose**: Enhanced role-based access control
- **Roles**:
  - `NONE` - No permissions
  - `OPERATOR` - Basic operations
  - `MANAGER` - Game settings management
  - `ADMIN` - Contract and admin management
  - `OWNER` - Full control
- **Features**:
  - Emergency mode controls
  - Role assignment and revocation
  - Operation permission checking

## Security Features

### 1. Signature Verification

All critical operations require cryptographic signatures:

```solidity
// Example: Adding RICE with signature
function addRICE(
    address player,
    uint256 amount,
    bytes32 operationHash,
    bytes memory signature
) external whenNotPaused {
    // Verify signature matches game owner
    require(signer == gameOwner, "Invalid signature");
    // Process operation
}
```

### 2. Anti-Spam Protection

Time-based cooldowns prevent abuse:

```solidity
uint256 public constant MIN_TIME_BETWEEN_OPERATIONS = 30 seconds;
mapping(address => uint256) public lastOperationTimestamp;
```

### 3. Role-Based Access Control

Multiple admin levels with granular permissions:

```solidity
enum Role {
    NONE,
    OPERATOR,      // Basic operations
    MANAGER,       // Game settings
    ADMIN,         // Contract management
    OWNER          // Full control
}
```

### 4. Emergency Controls

Emergency mode for crisis situations:

```solidity
bool public emergencyMode = false;
address public emergencyAdmin;

modifier whenNotEmergency() {
    require(!emergencyMode, "Contract is in emergency mode");
    _;
}
```

## Deployment Process

### 1. Deploy Admin Controller

```bash
npx hardhat run scripts/deploy-modular.cjs --network <network>
```

### 2. Deploy Game Registry

The registry serves as the central point for contract discovery.

### 3. Deploy Core Contracts

RICEManager, ScoreBoard, and PowerUpManager are deployed with interface implementations.

### 4. Configure Cross-Contract References

All contracts are linked through the registry pattern.

### 5. Set Up Admin Roles

Configure role-based access control for different admin levels.

## Usage Examples

### Getting Player Data via Registry

```solidity
// Get RICE balance
uint256 balance = gameRegistry.getRICEBalance(playerAddress);

// Get best score
uint256 bestScore = gameRegistry.getPlayerBestScore(playerAddress);

// Get power-up levels
uint256[] memory levels = gameRegistry.getPowerUpLevels(playerAddress);

// Get leaderboard
IScoreBoard.LeaderboardEntry[] memory entries = gameRegistry.getLeaderboard(0, 10);
```

### Admin Operations

```solidity
// Set user role
adminController.setUserRole(userAddress, Role.OPERATOR);

// Check permissions
bool canOperate = adminController.canPerformOperation(userAddress, Role.OPERATOR);

// Emergency controls
adminController.setEmergencyMode(true);
```

## Benefits of This Architecture

### 1. **Modularity**

- Clear separation of concerns
- Easy to upgrade individual components
- Interface-based interactions

### 2. **Security**

- Multiple layers of access control
- Signature-based operations
- Emergency controls for crisis situations

### 3. **Scalability**

- Registry pattern for contract discovery
- Role-based permissions
- Easy to add new contracts

### 4. **Maintainability**

- Well-documented interfaces
- Clear admin hierarchies
- Standardized patterns

## Migration from Current Architecture

### 1. **Frontend Updates**

Update your frontend to use the new contract addresses and interfaces:

```typescript
// Old way
const riceManager = new ethers.Contract(address, abi, signer);

// New way
const gameRegistry = new ethers.Contract(registryAddress, registryAbi, signer);
const balance = await gameRegistry.getRICEBalance(playerAddress);
```

### 2. **API Updates**

Your API endpoints can now use the registry for unified contract access:

```javascript
// Get all player data in one call
const playerData = await gameRegistry.getPlayerData(playerAddress);
```

### 3. **Admin Interface**

Consider building an admin interface that uses the new role-based system:

```javascript
// Check admin permissions
const canManage = await adminController.hasRole(adminAddress, Role.ADMIN);
```

## Testing with Foundry

As recommended, consider migrating to [Foundry](https://getfoundry.sh/) for better testing:

```solidity
// Example test structure
contract GameTest is Test {
    function setUp() public {
        // Deploy contracts
        // Set up admin roles
        // Configure security keys
    }

    function testAddRICE() public {
        // Test RICE operations
    }

    function testAdminControls() public {
        // Test role-based access
    }
}
```

## Next Steps

1. **Deploy the new architecture** using the provided script
2. **Update your frontend** to use the new interfaces
3. **Test thoroughly** with your existing game logic
4. **Consider Foundry migration** for better development experience
5. **Implement additional admin controls** as needed

## References

- [Solidity by Example - Interfaces](https://solidity-by-example.org/interface/)
- [Yearn Tokenized Strategy Template](https://github.com/yearn/tokenized-strategy-foundry-mix)
- [Foundry Documentation](https://getfoundry.sh/)
