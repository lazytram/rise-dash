// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IClanRegistry {
    struct Clan {
        string name;
        uint256 members;
        bool exists;
    }

    // Emitted when a new clan is created by the owner
    event ClanAdded(bytes32 indexed clanId, string name);

    // Emitted when an existing clan metadata is updated
    event ClanUpdated(bytes32 indexed clanId, string name);

    // Emitted when a player links their wallet to a clan
    event ClanChosen(address indexed player, bytes32 indexed clanId);

    // Emitted when a player's best distance increases
    event BestDistanceUpdated(
        address indexed player,
        bytes32 indexed clanId,
        uint256 increase,
        uint256 playerBest,
        uint256 clanTotalBest
    );

    // Seasons
    event SeasonStarted(
        uint256 indexed seasonId,
        uint64 startTime,
        uint64 endTime,
        string uri
    );
    event SeasonEnded(uint256 indexed seasonId);

    // ============ Admin ============
    function addClan(bytes32 clanId, string calldata name) external;

    /**
     * @notice Update clan metadata while keeping its immutable ID
     */
    function updateClan(bytes32 clanId, string calldata name) external;

    // ============ Player actions ============
    function chooseClan(bytes32 clanId) external;

    // ============ Views ============
    function getClan(bytes32 clanId) external view returns (Clan memory);

    function getPlayerClan(address player) external view returns (bytes32);

    function getClanMembers(bytes32 clanId) external view returns (uint256);

    function clanExists(bytes32 clanId) external view returns (bool);

    // ======= Distance aggregation / contributors =======
    function setUpdater(address updater, bool allowed) external;

    function isUpdater(address account) external view returns (bool);

    // Submit a player's run distance. Only improves their best if higher.
    function addDistance(address player, uint256 distance) external;

    function getPlayerDistance(address player) external view returns (uint256);

    function getClanTotalDistance(
        bytes32 clanId
    ) external view returns (uint256);

    /**
     * @notice Convenience view returning (members, totalDistance) for a clan
     */
    function getClanStats(
        bytes32 clanId
    ) external view returns (uint256 members, uint256 totalDistance);

    // ======= Batch / listings =======
    function getClanIds() external view returns (bytes32[] memory ids);

    function getClanStatsBatch(
        bytes32[] calldata ids
    ) external view returns (uint256[] memory members, uint256[] memory totals);

    // ======= Convenience views =======
    function getPlayerProfile(
        address player
    ) external view returns (bytes32 clanId, uint256 bestDistance);

    // ======= Seasons views =======
    function currentSeasonId() external view returns (uint256);
    function getSeasonTimes(
        uint256 seasonId
    )
        external
        view
        returns (uint64 startTime, uint64 endTime, string memory uri);
    function getPlayerDistanceForSeason(
        address player,
        uint256 seasonId
    ) external view returns (uint256);
    function getClanTotalDistanceForSeason(
        bytes32 clanId,
        uint256 seasonId
    ) external view returns (uint256);
    function getClanStatsForSeason(
        bytes32 clanId,
        uint256 seasonId
    ) external view returns (uint256 members, uint256 totalDistance);

    // ======= Seasons admin =======
    function startSeason(
        uint64 startTime,
        uint64 endTime,
        string calldata uri
    ) external;
    function endSeason() external;

    // ======= Player history =======
    function getPlayerSeasonDistances(
        address player,
        uint256[] calldata seasonIds
    ) external view returns (uint256[] memory distances);

    function getTopContributors(
        bytes32 clanId
    )
        external
        view
        returns (address[5] memory players, uint256[5] memory totals);
}
