// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IDojoRegistry.sol";

contract DojoRegistry is Ownable, IDojoRegistry {
    mapping(bytes32 => Dojo) private _dojos;
    bytes32[] private _dojoIds;
    mapping(address => bytes32) private _playerDojo;
    mapping(address => uint256) private _playerBestDistance;
    mapping(bytes32 => uint256) private _dojoTotalBestDistance;
    mapping(address => bool) private _isUpdater;

    constructor(address initialOwner) Ownable(initialOwner) {}

    // ============ Admin ============
    function addDojo(bytes32 dojoId, string calldata name) external onlyOwner {
        require(dojoId != bytes32(0), "Invalid id");
        require(!_dojos[dojoId].exists, "Dojo exists");
        _dojos[dojoId] = Dojo({name: name, members: 0, exists: true});
        _dojoIds.push(dojoId);
        emit DojoAdded(dojoId, name);
    }

    /**
     * @notice Update dojo metadata (name, motto) while keeping its immutable ID
     */
    function updateDojo(
        bytes32 dojoId,
        string calldata name
    ) external onlyOwner {
        require(_dojos[dojoId].exists, "Unknown dojo");
        _dojos[dojoId].name = name;
        emit DojoUpdated(dojoId, name);
    }

    // ============ Player actions ============
    function chooseDojo(bytes32 dojoId) external {
        require(_dojos[dojoId].exists, "Unknown dojo");
        require(_playerDojo[msg.sender] == bytes32(0), "Already chosen");
        _playerDojo[msg.sender] = dojoId;
        _dojos[dojoId].members += 1;
        emit DojoChosen(msg.sender, dojoId);
    }

    // ============ Views ============
    function getDojo(bytes32 dojoId) external view returns (Dojo memory) {
        require(_dojos[dojoId].exists, "Unknown dojo");
        return _dojos[dojoId];
    }

    function getPlayerDojo(address player) external view returns (bytes32) {
        return _playerDojo[player];
    }

    function getDojoMembers(bytes32 dojoId) external view returns (uint256) {
        require(_dojos[dojoId].exists, "Unknown dojo");
        return _dojos[dojoId].members;
    }

    function dojoExists(bytes32 dojoId) external view returns (bool) {
        return _dojos[dojoId].exists;
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
        bytes32 dojoId = _playerDojo[player];
        require(dojoId != bytes32(0), "Player has no dojo");
        uint256 currentBest = _playerBestDistance[player];
        if (distance > currentBest) {
            uint256 increase = distance - currentBest;
            unchecked {
                _playerBestDistance[player] = distance;
                _dojoTotalBestDistance[dojoId] += increase;
            }
            emit BestDistanceUpdated(
                player,
                dojoId,
                increase,
                distance,
                _dojoTotalBestDistance[dojoId]
            );
        }
    }

    function getPlayerDistance(address player) external view returns (uint256) {
        return _playerBestDistance[player];
    }

    function getDojoTotalDistance(
        bytes32 dojoId
    ) external view returns (uint256) {
        return _dojoTotalBestDistance[dojoId];
    }

    function getDojoStats(
        bytes32 dojoId
    ) external view returns (uint256 members, uint256 totalDistance) {
        require(_dojos[dojoId].exists, "Unknown dojo");
        return (_dojos[dojoId].members, _dojoTotalBestDistance[dojoId]);
    }

    function getDojoIds() external view returns (bytes32[] memory ids) {
        return _dojoIds;
    }

    function getDojoStatsBatch(
        bytes32[] calldata ids
    )
        external
        view
        returns (uint256[] memory members, uint256[] memory totals)
    {
        members = new uint256[](ids.length);
        totals = new uint256[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            bytes32 dojoId = ids[i];
            require(_dojos[dojoId].exists, "Unknown dojo");
            members[i] = _dojos[dojoId].members;
            totals[i] = _dojoTotalBestDistance[dojoId];
        }
    }

    function getPlayerProfile(
        address player
    ) external view returns (bytes32 dojoId, uint256 bestDistance) {
        dojoId = _playerDojo[player];
        bestDistance = _playerBestDistance[player];
    }

    function getTopContributors(
        bytes32 /*dojoId*/
    )
        external
        pure
        returns (address[5] memory players, uint256[5] memory totals)
    {
        // NOTE: This is a placeholder to keep interface stable.
        // A production version would maintain per-dojo ordered sets or use an offchain indexer.
        players;
        totals;
    }
}
