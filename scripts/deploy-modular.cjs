const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying modular game architecture...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // ================================
  // DEPLOY ADMIN CONTROLLER
  // ================================
  console.log("\n🔐 Deploying AdminController...");
  const AdminController = await ethers.getContractFactory("AdminController");
  const adminController = await AdminController.deploy();
  await adminController.waitForDeployment();
  console.log(
    "✅ AdminController deployed to:",
    await adminController.getAddress()
  );

  // ================================
  // DEPLOY GAME REGISTRY
  // ================================
  console.log("\n📋 Deploying GameRegistry...");
  const GameRegistry = await ethers.getContractFactory("GameRegistry");
  const gameRegistry = await GameRegistry.deploy();
  await gameRegistry.waitForDeployment();
  console.log("✅ GameRegistry deployed to:", await gameRegistry.getAddress());

  // ================================
  // DEPLOY CORE CONTRACTS
  // ================================
  console.log("\n🎮 Deploying core contracts...");

  // Deploy RICEManager
  console.log("💰 Deploying RICEManager...");
  const RICEManager = await ethers.getContractFactory("RICEManager");
  const riceManager = await RICEManager.deploy();
  await riceManager.waitForDeployment();
  console.log("✅ RICEManager deployed to:", await riceManager.getAddress());

  // Deploy ScoreBoard
  console.log("🏆 Deploying ScoreBoard...");
  const ScoreBoard = await ethers.getContractFactory("ScoreBoard");
  const scoreBoard = await ScoreBoard.deploy();
  await scoreBoard.waitForDeployment();
  console.log("✅ ScoreBoard deployed to:", await scoreBoard.getAddress());

  // Deploy PowerUpManager
  console.log("⚡ Deploying PowerUpManager...");
  const PowerUpManager = await ethers.getContractFactory("PowerUpManager");
  const powerUpManager = await PowerUpManager.deploy(
    await riceManager.getAddress(),
    deployer.address // gameServer address
  );
  await powerUpManager.waitForDeployment();
  console.log(
    "✅ PowerUpManager deployed to:",
    await powerUpManager.getAddress()
  );

  // ================================
  // CONFIGURE CONTRACT ADDRESSES
  // ================================
  console.log("\n🔗 Configuring contract addresses...");

  // Set contract addresses in GameRegistry
  console.log("📋 Setting contract addresses in GameRegistry...");
  await gameRegistry.setRICEManager(await riceManager.getAddress());
  await gameRegistry.setScoreBoard(await scoreBoard.getAddress());
  await gameRegistry.setPowerUpManager(await powerUpManager.getAddress());
  console.log("✅ Contract addresses set in GameRegistry");

  // Set contract addresses in individual contracts
  console.log("🔗 Setting cross-contract references...");

  // Set ScoreBoard address in RICEManager
  await riceManager.setScoreBoardAddress(await scoreBoard.getAddress());
  console.log("✅ ScoreBoard address set in RICEManager");

  // Set PowerUpManager address in RICEManager
  await riceManager.setPowerUpManagerAddress(await powerUpManager.getAddress());
  console.log("✅ PowerUpManager address set in RICEManager");

  // Set RICEManager address in ScoreBoard
  await scoreBoard.setRICEManagerAddress(await riceManager.getAddress());
  console.log("✅ RICEManager address set in ScoreBoard");

  // ================================
  // SETUP ADMIN ROLES
  // ================================
  console.log("\n👥 Setting up admin roles...");

  // Set up roles in AdminController
  const { Role } = await ethers.getContractFactory("AdminController");

  // Add deployer as admin
  await adminController.setUserRole(deployer.address, 3); // ADMIN role
  console.log("✅ Deployer set as admin");

  // Add game server as operator
  await adminController.setUserRole(deployer.address, 1); // OPERATOR role
  console.log("✅ Game server set as operator");

  // ================================
  // SETUP SECURITY KEYS
  // ================================
  console.log("\n🔑 Setting up security keys...");

  // Generate security keys
  const securityKey1 = ethers.keccak256(
    ethers.toUtf8Bytes("RICE_MANAGER_SECURITY_KEY")
  );
  const securityKey2 = ethers.keccak256(
    ethers.toUtf8Bytes("SCOREBOARD_SECURITY_KEY")
  );
  const securityKey3 = ethers.keccak256(
    ethers.toUtf8Bytes("POWERUP_MANAGER_SECURITY_KEY")
  );

  // Set security keys
  await riceManager.setSecurityKey(securityKey1);
  await scoreBoard.setSecurityKey(securityKey2);
  await powerUpManager.setSecurityKey(securityKey3);
  console.log("✅ Security keys set");

  // ================================
  // VERIFY DEPLOYMENT
  // ================================
  console.log("\n🔍 Verifying deployment...");

  // Verify contract addresses in registry
  const [regRiceManager, regScoreBoard, regPowerUpManager] =
    await gameRegistry.getContractAddresses();
  console.log("📋 Registry contract addresses:");
  console.log("  RICEManager:", regRiceManager);
  console.log("  ScoreBoard:", regScoreBoard);
  console.log("  PowerUpManager:", regPowerUpManager);

  // Verify admin setup
  const deployerRole = await adminController.getUserRole(deployer.address);
  console.log("👥 Deployer role:", deployerRole);

  // ================================
  // DEPLOYMENT SUMMARY
  // ================================
  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("  AdminController:", await adminController.getAddress());
  console.log("  GameRegistry:", await gameRegistry.getAddress());
  console.log("  RICEManager:", await riceManager.getAddress());
  console.log("  ScoreBoard:", await scoreBoard.getAddress());
  console.log("  PowerUpManager:", await powerUpManager.getAddress());

  console.log("\n🔑 Security Keys:");
  console.log("  RICEManager:", securityKey1);
  console.log("  ScoreBoard:", securityKey2);
  console.log("  PowerUpManager:", securityKey3);

  console.log("\n📝 Next steps:");
  console.log(
    "  1. Update your frontend configuration with the new contract addresses"
  );
  console.log(
    "  2. Test the modular architecture with your existing API endpoints"
  );
  console.log(
    "  3. Consider migrating to Foundry for better testing and debugging"
  );
  console.log("  4. Implement additional admin controls as needed");

  return {
    adminController: await adminController.getAddress(),
    gameRegistry: await gameRegistry.getAddress(),
    riceManager: await riceManager.getAddress(),
    scoreBoard: await scoreBoard.getAddress(),
    powerUpManager: await powerUpManager.getAddress(),
    securityKeys: {
      riceManager: securityKey1,
      scoreBoard: securityKey2,
      powerUpManager: securityKey3,
    },
  };
}

main()
  .then((result) => {
    console.log("\n✅ Deployment script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
