// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AdminController
 * @dev Enhanced role-based access control for game contracts
 * Provides multiple admin levels and better security controls
 */
contract AdminController {
    // ================================
    // STORAGE
    // ================================

    // Role definitions
    enum Role {
        NONE,
        OPERATOR, // Can perform basic operations
        MANAGER, // Can manage game settings
        ADMIN, // Can manage contracts and admins
        OWNER // Full control
    }

    // Role assignments
    mapping(address => Role) public userRoles;

    // Contract ownership
    address public owner;
    bool public paused = false;

    // Emergency controls
    bool public emergencyMode = false;
    address public emergencyAdmin;

    // ================================
    // EVENTS
    // ================================
    event RoleUpdated(address indexed user, Role oldRole, Role newRole);
    event OwnerUpdated(address indexed oldOwner, address indexed newOwner);
    event ContractPaused(bool paused);
    event EmergencyModeUpdated(bool emergencyMode);
    event EmergencyAdminUpdated(
        address indexed oldAdmin,
        address indexed newAdmin
    );

    // ================================
    // MODIFIERS
    // ================================

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAdmin() {
        require(
            userRoles[msg.sender] >= Role.ADMIN,
            "Only admin or higher can call this function"
        );
        _;
    }

    modifier onlyManager() {
        require(
            userRoles[msg.sender] >= Role.MANAGER,
            "Only manager or higher can call this function"
        );
        _;
    }

    modifier onlyOperator() {
        require(
            userRoles[msg.sender] >= Role.OPERATOR,
            "Only operator or higher can call this function"
        );
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    modifier whenNotEmergency() {
        require(!emergencyMode, "Contract is in emergency mode");
        _;
    }

    // ================================
    // CONSTRUCTOR
    // ================================

    constructor() {
        owner = msg.sender;
        userRoles[msg.sender] = Role.OWNER;
        emergencyAdmin = msg.sender;
    }

    // ================================
    // VIEW FUNCTIONS
    // ================================

    /**
     * @dev Gets the role of a user
     * @param _user The user address
     * @return The user's role
     */
    function getUserRole(address _user) external view returns (Role) {
        return userRoles[_user];
    }

    /**
     * @dev Checks if a user has a specific role or higher
     * @param _user The user address
     * @param _role The required role
     * @return True if user has the role or higher
     */
    function hasRole(address _user, Role _role) external view returns (bool) {
        return userRoles[_user] >= _role;
    }

    /**
     * @dev Gets contract status information
     * @return _owner Owner address
     * @return _paused Whether contract is paused
     * @return _emergencyMode Whether emergency mode is active
     * @return _emergencyAdmin Emergency admin address
     */
    function getContractInfo()
        external
        view
        returns (
            address _owner,
            bool _paused,
            bool _emergencyMode,
            address _emergencyAdmin
        )
    {
        return (owner, paused, emergencyMode, emergencyAdmin);
    }

    // ================================
    // ADMIN FUNCTIONS
    // ================================

    /**
     * @dev Sets a user's role (only admin or higher)
     * @param _user The user address
     * @param _role The new role
     */
    function setUserRole(
        address _user,
        Role _role
    ) external onlyAdmin whenNotPaused {
        require(_user != address(0), "Invalid address");
        Role oldRole = userRoles[_user];
        userRoles[_user] = _role;
        emit RoleUpdated(_user, oldRole, _role);
    }

    /**
     * @dev Updates the owner (only owner)
     * @param _newOwner The new owner address
     */
    function setOwner(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        address oldOwner = owner;
        owner = _newOwner;
        userRoles[_newOwner] = Role.OWNER;
        emit OwnerUpdated(oldOwner, _newOwner);
    }

    /**
     * @dev Pauses or unpauses the contract (only admin or higher)
     * @param _paused True to pause, false to unpause
     */
    function setPaused(bool _paused) external onlyAdmin {
        paused = _paused;
        emit ContractPaused(_paused);
    }

    /**
     * @dev Sets emergency mode (only emergency admin)
     * @param _emergencyMode True to enable emergency mode
     */
    function setEmergencyMode(bool _emergencyMode) external {
        require(
            msg.sender == emergencyAdmin || userRoles[msg.sender] >= Role.ADMIN,
            "Only emergency admin or admin can call this function"
        );
        emergencyMode = _emergencyMode;
        emit EmergencyModeUpdated(_emergencyMode);
    }

    /**
     * @dev Updates the emergency admin (only owner)
     * @param _newEmergencyAdmin The new emergency admin address
     */
    function setEmergencyAdmin(address _newEmergencyAdmin) external onlyOwner {
        require(_newEmergencyAdmin != address(0), "Invalid address");
        address oldAdmin = emergencyAdmin;
        emergencyAdmin = _newEmergencyAdmin;
        emit EmergencyAdminUpdated(oldAdmin, _newEmergencyAdmin);
    }

    /**
     * @dev Emergency function to revoke all roles except owner (only emergency admin)
     * @param _users Array of user addresses to revoke
     */
    function emergencyRevokeRoles(address[] calldata _users) external {
        require(
            msg.sender == emergencyAdmin || userRoles[msg.sender] >= Role.ADMIN,
            "Only emergency admin or admin can call this function"
        );
        for (uint256 i = 0; i < _users.length; i++) {
            if (_users[i] != owner) {
                Role oldRole = userRoles[_users[i]];
                userRoles[_users[i]] = Role.NONE;
                emit RoleUpdated(_users[i], oldRole, Role.NONE);
            }
        }
    }

    // ================================
    // UTILITY FUNCTIONS
    // ================================

    /**
     * @dev Checks if a user can perform an operation based on role requirements
     * @param _user The user address
     * @param _requiredRole The required role level
     * @return True if user can perform the operation
     */
    function canPerformOperation(
        address _user,
        Role _requiredRole
    ) external view returns (bool) {
        if (emergencyMode) {
            return _user == emergencyAdmin || _user == owner;
        }
        return userRoles[_user] >= _requiredRole;
    }

    /**
     * @dev Gets all users with a specific role or higher
     * @param _role The minimum role to include
     * @return Array of user addresses
     */
    function getUsersWithRole(
        Role _role
    ) external view returns (address[] memory) {
        // This is a simplified implementation
        // In a real implementation, you might want to maintain a list of users
        return new address[](0);
    }
}
