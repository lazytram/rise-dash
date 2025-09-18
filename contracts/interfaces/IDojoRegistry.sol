// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IDojoRegistry {
    struct Dojo {
        string name;
        uint256 members;
        bool exists;
    }

    // Emitted when a new dojo is created by the owner
    event DojoAdded(bytes32 indexed dojoId, string name);

    // Emitted when an existing dojo metadata is updated
    event DojoUpdated(bytes32 indexed dojoId, string name);

    // Emitted when a player links their wallet to a dojo
    event DojoChosen(address indexed player, bytes32 indexed dojoId);

    // Emitted when a player's best distance increases
    event BestDistanceUpdated(
        address indexed player,
        bytes32 indexed dojoId,
        uint256 increase,
        uint256 playerBest,
        uint256 dojoTotalBest
    );

    // ============ Admin ============
    function addDojo(bytes32 dojoId, string calldata name) external;

    /**
     * @notice Update dojo metadata while keeping its immutable ID
     */
    function updateDojo(bytes32 dojoId, string calldata name) external;

    // ============ Player actions ============
    function chooseDojo(bytes32 dojoId) external;

    // ============ Views ============
    function getDojo(bytes32 dojoId) external view returns (Dojo memory);

    function getPlayerDojo(address player) external view returns (bytes32);

    function getDojoMembers(bytes32 dojoId) external view returns (uint256);

    function dojoExists(bytes32 dojoId) external view returns (bool);

    // ======= Distance aggregation / contributors =======
    function setUpdater(address updater, bool allowed) external;

    function isUpdater(address account) external view returns (bool);

    // Submit a player's run distance. Only improves their best if higher.
    function addDistance(address player, uint256 distance) external;

    function getPlayerDistance(address player) external view returns (uint256);

    function getDojoTotalDistance(
        bytes32 dojoId
    ) external view returns (uint256);

    /**
     * @notice Convenience view returning (members, totalDistance) for a dojo
     */
    function getDojoStats(
        bytes32 dojoId
    ) external view returns (uint256 members, uint256 totalDistance);

    // ======= Batch / listings =======
    function getDojoIds() external view returns (bytes32[] memory ids);

    function getDojoStatsBatch(
        bytes32[] calldata ids
    ) external view returns (uint256[] memory members, uint256[] memory totals);

    // ======= Convenience views =======
    function getPlayerProfile(
        address player
    ) external view returns (bytes32 dojoId, uint256 bestDistance);

    function getTopContributors(
        bytes32 dojoId
    )
        external
        view
        returns (address[5] memory players, uint256[5] memory totals);
}
