// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IClanRegistry.sol";

contract ClanRegistry is Ownable, IClanRegistry {
    mapping(bytes32 => Clan) private _clans;
    bytes32[] private _clanIds;
    mapping(address => bytes32) private _playerClan;
    mapping(address => uint256) private _playerBestDistance;
    mapping(bytes32 => uint256) private _clanTotalBestDistance;
    mapping(address => bool) private _isUpdater;

    // Seasons
    uint256 private _currentSeasonId;
    struct SeasonMeta {
        uint64 startTime;
        uint64 endTime;
        string uri;
    }
    mapping(uint256 => SeasonMeta) private _seasonMeta;
    mapping(uint256 => mapping(address => uint256)) private _playerBestBySeason;
    mapping(uint256 => mapping(bytes32 => uint256))
        private _clanTotalBestBySeason;

    constructor(address initialOwner) Ownable(initialOwner) {}

    // ============ Admin ============
    function addClan(bytes32 clanId, string calldata name) external onlyOwner {
        require(clanId != bytes32(0), "Invalid id");
        require(!_clans[clanId].exists, "Clan exists");
        _clans[clanId] = Clan({name: name, members: 0, exists: true});
        _clanIds.push(clanId);
        emit ClanAdded(clanId, name);
    }

    /**
     * @notice Update clan metadata while keeping its immutable ID
     */
    function updateClan(
        bytes32 clanId,
        string calldata name
    ) external onlyOwner {
        require(_clans[clanId].exists, "Unknown clan");
        _clans[clanId].name = name;
        emit ClanUpdated(clanId, name);
    }

    // ============ Player actions ============
    function chooseClan(bytes32 clanId) external {
        require(_clans[clanId].exists, "Unknown clan");
        require(_playerClan[msg.sender] == bytes32(0), "Already chosen");
        _playerClan[msg.sender] = clanId;
        _clans[clanId].members += 1;
        emit ClanChosen(msg.sender, clanId);
    }

    // ============ Views ============
    function getClan(bytes32 clanId) external view returns (Clan memory) {
        require(_clans[clanId].exists, "Unknown clan");
        return _clans[clanId];
    }

    function getPlayerClan(address player) external view returns (bytes32) {
        return _playerClan[player];
    }

    function getClanMembers(bytes32 clanId) external view returns (uint256) {
        require(_clans[clanId].exists, "Unknown clan");
        return _clans[clanId].members;
    }

    function clanExists(bytes32 clanId) external view returns (bool) {
        return _clans[clanId].exists;
    }

    // ======= Distance aggregation / contributors =======
    function setUpdater(address updater, bool allowed) external onlyOwner {
        _isUpdater[updater] = allowed;
    }

    function isUpdater(address account) external view returns (bool) {
        return _isUpdater[account];
    }

    function addDistance(address player, uint256 distance) external {
        require(_isUpdater[msg.sender], "Not updater");
        bytes32 clanId = _playerClan[player];
        require(clanId != bytes32(0), "Player has no clan");
        uint256 currentBest = _playerBestDistance[player];
        if (distance > currentBest) {
            uint256 increase = distance - currentBest;
            unchecked {
                _playerBestDistance[player] = distance;
                _clanTotalBestDistance[clanId] += increase;
                // season-scoped
                uint256 seasonId = _currentSeasonId;
                if (seasonId != 0) {
                    uint256 prev = _playerBestBySeason[seasonId][player];
                    if (distance > prev) {
                        uint256 inc = distance - prev;
                        _playerBestBySeason[seasonId][player] = distance;
                        _clanTotalBestBySeason[seasonId][clanId] += inc;
                    }
                }
            }
            emit BestDistanceUpdated(
                player,
                clanId,
                increase,
                distance,
                _clanTotalBestDistance[clanId]
            );
        }
    }

    function getPlayerDistance(address player) external view returns (uint256) {
        return _playerBestDistance[player];
    }

    function getClanTotalDistance(
        bytes32 clanId
    ) external view returns (uint256) {
        return _clanTotalBestDistance[clanId];
    }

    function getClanStats(
        bytes32 clanId
    ) external view returns (uint256 members, uint256 totalDistance) {
        require(_clans[clanId].exists, "Unknown clan");
        return (_clans[clanId].members, _clanTotalBestDistance[clanId]);
    }

    // ===== Seasons views =====
    function currentSeasonId() external view returns (uint256) {
        return _currentSeasonId;
    }

    function getSeasonTimes(
        uint256 seasonId
    )
        external
        view
        returns (uint64 startTime, uint64 endTime, string memory uri)
    {
        SeasonMeta storage m = _seasonMeta[seasonId];
        return (m.startTime, m.endTime, m.uri);
    }

    function getPlayerDistanceForSeason(
        address player,
        uint256 seasonId
    ) external view returns (uint256) {
        return _playerBestBySeason[seasonId][player];
    }

    function getClanTotalDistanceForSeason(
        bytes32 clanId,
        uint256 seasonId
    ) external view returns (uint256) {
        return _clanTotalBestBySeason[seasonId][clanId];
    }

    function getClanStatsForSeason(
        bytes32 clanId,
        uint256 seasonId
    ) external view returns (uint256 members, uint256 totalDistance) {
        require(_clans[clanId].exists, "Unknown clan");
        return (
            _clans[clanId].members,
            _clanTotalBestBySeason[seasonId][clanId]
        );
    }

    function getPlayerSeasonDistances(
        address player,
        uint256[] calldata seasonIds
    ) external view returns (uint256[] memory distances) {
        distances = new uint256[](seasonIds.length);
        for (uint256 i = 0; i < seasonIds.length; i++) {
            distances[i] = _playerBestBySeason[seasonIds[i]][player];
        }
    }

    // ===== Seasons admin =====
    function startSeason(
        uint64 startTime,
        uint64 endTime,
        string calldata uri
    ) external onlyOwner {
        require(endTime > startTime, "Invalid times");
        uint256 nextId = _currentSeasonId + 1;
        _currentSeasonId = nextId;
        _seasonMeta[nextId] = SeasonMeta({
            startTime: startTime,
            endTime: endTime,
            uri: uri
        });
        emit SeasonStarted(nextId, startTime, endTime, uri);
    }

    function endSeason() external onlyOwner {
        uint256 id = _currentSeasonId;
        require(id != 0, "No season");
        emit SeasonEnded(id);
    }

    function getClanIds() external view returns (bytes32[] memory ids) {
        return _clanIds;
    }

    function getClanStatsBatch(
        bytes32[] calldata ids
    )
        external
        view
        returns (uint256[] memory members, uint256[] memory totals)
    {
        members = new uint256[](ids.length);
        totals = new uint256[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            bytes32 clanId = ids[i];
            require(_clans[clanId].exists, "Unknown clan");
            members[i] = _clans[clanId].members;
            totals[i] = _clanTotalBestDistance[clanId];
        }
    }

    function getPlayerProfile(
        address player
    ) external view returns (bytes32 clanId, uint256 bestDistance) {
        clanId = _playerClan[player];
        bestDistance = _playerBestDistance[player];
    }

    function getTopContributors(
        bytes32 /*clanId*/
    )
        external
        pure
        returns (address[5] memory players, uint256[5] memory totals)
    {
        // Placeholder for off-chain indexing approach
        players;
        totals;
    }
}
