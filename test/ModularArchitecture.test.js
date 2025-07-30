const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Modular Architecture", function () {
  let adminController, gameRegistry, riceManager, scoreBoard, powerUpManager;
  let owner, player1, player2, admin1, operator1;
  let securityKey1, securityKey2, securityKey3;

  beforeEach(async function () {
    [owner, player1, player2, admin1, operator1] = await ethers.getSigners();

    // Generate security keys
    securityKey1 = ethers.keccak256(
      ethers.toUtf8Bytes("RICE_MANAGER_SECURITY_KEY")
    );
    securityKey2 = ethers.keccak256(
      ethers.toUtf8Bytes("SCOREBOARD_SECURITY_KEY")
    );
    securityKey3 = ethers.keccak256(
      ethers.toUtf8Bytes("POWERUP_MANAGER_SECURITY_KEY")
    );

    // Deploy contracts
    const AdminController = await ethers.getContractFactory("AdminController");
    adminController = await AdminController.deploy();

    const GameRegistry = await ethers.getContractFactory("GameRegistry");
    gameRegistry = await GameRegistry.deploy();

    const RICEManager = await ethers.getContractFactory("RICEManager");
    riceManager = await RICEManager.deploy();

    const ScoreBoard = await ethers.getContractFactory("ScoreBoard");
    scoreBoard = await ScoreBoard.deploy();

    const PowerUpManager = await ethers.getContractFactory("PowerUpManager");
    powerUpManager = await PowerUpManager.deploy(
      await riceManager.getAddress(),
      owner.address
    );

    // Configure contract addresses
    await gameRegistry.setRICEManager(await riceManager.getAddress());
    await gameRegistry.setScoreBoard(await scoreBoard.getAddress());
    await gameRegistry.setPowerUpManager(await powerUpManager.getAddress());

    await riceManager.setScoreBoardAddress(await scoreBoard.getAddress());
    await riceManager.setPowerUpManagerAddress(
      await powerUpManager.getAddress()
    );
    await scoreBoard.setRICEManagerAddress(await riceManager.getAddress());

    // Set security keys
    await riceManager.setSecurityKey(securityKey1);
    await scoreBoard.setSecurityKey(securityKey2);
    await powerUpManager.setSecurityKey(securityKey3);

    // Set up admin roles
    await adminController.setUserRole(admin1.address, 3); // ADMIN
    await adminController.setUserRole(operator1.address, 1); // OPERATOR
  });

  describe("Admin Controls", function () {
    it("Should enforce role-based access control", async function () {
      // Only admin can set user roles
      await expect(
        adminController.connect(operator1).setUserRole(player1.address, 1)
      ).to.be.revertedWith("Only admin or higher can call this function");

      // Admin can set user roles
      await expect(
        adminController.connect(admin1).setUserRole(player1.address, 1)
      ).to.not.be.reverted;
    });

    it("Should allow emergency mode controls", async function () {
      // Set emergency mode
      await adminController.connect(admin1).setEmergencyMode(true);

      const info = await adminController.getContractInfo();
      expect(info[2]).to.be.true; // emergencyMode
    });

    it("Should check operation permissions correctly", async function () {
      // Check if operator can perform operations
      const canOperate = await adminController.canPerformOperation(
        operator1.address,
        1 // OPERATOR role
      );
      expect(canOperate).to.be.true;

      // Check if player cannot perform admin operations
      const canAdmin = await adminController.canPerformOperation(
        player1.address,
        3 // ADMIN role
      );
      expect(canAdmin).to.be.false;
    });
  });

  describe("Game Registry", function () {
    it("Should manage contract addresses correctly", async function () {
      const addresses = await gameRegistry.getContractAddresses();
      expect(addresses[0]).to.equal(await riceManager.getAddress());
      expect(addresses[1]).to.equal(await scoreBoard.getAddress());
      expect(addresses[2]).to.equal(await powerUpManager.getAddress());
    });

    it("Should provide unified interface for contract interactions", async function () {
      // Add RICE to player
      const operationHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      const messageHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["string", "address", "uint256", "bytes32"],
          ["ADD_RICE", player1.address, 100, operationHash]
        )
      );
      const signature = await owner.signMessage(ethers.getBytes(messageHash));

      await riceManager.addRICE(player1.address, 100, operationHash, signature);

      // Get balance via registry
      const balance = await gameRegistry.getRICEBalance(player1.address);
      expect(balance).to.equal(100);
    });

    it("Should enforce authorization for contract operations", async function () {
      // Try to set contract address without authorization
      await expect(
        gameRegistry.connect(player1).setRICEManager(player1.address)
      ).to.be.revertedWith("Only authorized admin can call this function");
    });
  });

  describe("Interface Implementation", function () {
    it("Should implement IRICEManager interface correctly", async function () {
      // Test interface functions
      const balance = await riceManager.getBalance(player1.address);
      expect(balance).to.equal(0);

      const canClaim = await riceManager.canClaimDailyReveal(player1.address);
      expect(canClaim).to.be.true;
    });

    it("Should implement IScoreBoard interface correctly", async function () {
      // Test interface functions
      const bestScore = await scoreBoard.getPlayerBestScore(player1.address);
      expect(bestScore).to.equal(0);

      const scoreCount = await scoreBoard.getScoreCount(player1.address);
      expect(scoreCount).to.equal(0);
    });

    it("Should implement IPowerUpManager interface correctly", async function () {
      // Test interface functions
      const levels = await powerUpManager.getPowerUpLevels(player1.address);
      expect(levels.length).to.equal(10);

      const config = await powerUpManager.getPowerUpConfig(0);
      expect(config[0]).to.equal(0); // baseCost
      expect(config[1]).to.equal(0); // maxLevel
    });
  });

  describe("Security Features", function () {
    it("Should prevent unauthorized RICE operations", async function () {
      const operationHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      const messageHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["string", "address", "uint256", "bytes32"],
          ["ADD_RICE", player1.address, 100, operationHash]
        )
      );
      const signature = await player1.signMessage(ethers.getBytes(messageHash));

      // Should fail because player1 is not the game owner
      await expect(
        riceManager.addRICE(player1.address, 100, operationHash, signature)
      ).to.be.revertedWith("Invalid signature");
    });

    it("Should prevent operation reuse", async function () {
      const operationHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      const messageHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["string", "address", "uint256", "bytes32"],
          ["ADD_RICE", player1.address, 100, operationHash]
        )
      );
      const signature = await owner.signMessage(ethers.getBytes(messageHash));

      // First operation should succeed
      await riceManager.addRICE(player1.address, 100, operationHash, signature);

      // Second operation with same hash should fail
      await expect(
        riceManager.addRICE(player1.address, 100, operationHash, signature)
      ).to.be.revertedWith("Operation hash already used");
    });

    it("Should enforce anti-spam protection", async function () {
      const operationHash1 = ethers.keccak256(ethers.toUtf8Bytes("test1"));
      const operationHash2 = ethers.keccak256(ethers.toUtf8Bytes("test2"));

      const messageHash1 = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["string", "address", "uint256", "bytes32"],
          ["ADD_RICE", player1.address, 100, operationHash1]
        )
      );
      const signature1 = await owner.signMessage(ethers.getBytes(messageHash1));

      const messageHash2 = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["string", "address", "uint256", "bytes32"],
          ["ADD_RICE", player1.address, 100, operationHash2]
        )
      );
      const signature2 = await owner.signMessage(ethers.getBytes(messageHash2));

      // First operation should succeed
      await riceManager.addRICE(
        player1.address,
        100,
        operationHash1,
        signature1
      );

      // Second operation should fail due to time restriction
      await expect(
        riceManager.addRICE(player1.address, 100, operationHash2, signature2)
      ).to.be.revertedWith("Too soon since last operation");
    });
  });

  describe("Modular Benefits", function () {
    it("Should allow easy contract upgrades", async function () {
      // Simulate upgrading RICEManager
      const newRiceManager = await ethers.getContractFactory("RICEManager");
      const newRice = await newRiceManager.deploy();

      // Update registry
      await gameRegistry.setRICEManager(await newRice.getAddress());

      // Verify update
      const addresses = await gameRegistry.getContractAddresses();
      expect(addresses[0]).to.equal(await newRice.getAddress());
    });

    it("Should provide clear separation of concerns", async function () {
      // RICEManager only handles RICE operations
      const balance = await riceManager.getBalance(player1.address);
      expect(balance).to.equal(0);

      // ScoreBoard only handles scores
      const bestScore = await scoreBoard.getPlayerBestScore(player1.address);
      expect(bestScore).to.equal(0);

      // PowerUpManager only handles power-ups
      const levels = await powerUpManager.getPowerUpLevels(player1.address);
      expect(levels.length).to.equal(10);
    });

    it("Should enable unified data access through registry", async function () {
      // Add some test data
      const operationHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      const messageHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["string", "address", "uint256", "bytes32"],
          ["ADD_RICE", player1.address, 100, operationHash]
        )
      );
      const signature = await owner.signMessage(ethers.getBytes(messageHash));
      await riceManager.addRICE(player1.address, 100, operationHash, signature);

      // Get all player data through registry
      const balance = await gameRegistry.getRICEBalance(player1.address);
      const bestScore = await gameRegistry.getPlayerBestScore(player1.address);
      const powerUps = await gameRegistry.getPowerUpLevels(player1.address);

      expect(balance).to.equal(100);
      expect(bestScore).to.equal(0);
      expect(powerUps.length).to.equal(10);
    });
  });
});
