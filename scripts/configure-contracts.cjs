const { ethers } = require("hardhat");

async function main() {
  console.log("🔧 Configuring deployed contracts...");

  // Utiliser la clé privée du compte avec des fonds
  const privateKey =
    "0xfc1026c56a57ce6985dc27a00c147d00d6727a16f4021cd938324339c8dd6a46";
  const wallet = new ethers.Wallet(privateKey, ethers.provider);

  console.log("📝 Configuring with account:", await wallet.getAddress());

  // Adresses des contrats déployés
  const adminControllerAddress = "0x78ee7dA36f5D32054781dAFCD06476636c093d4d";
  const gameRegistryAddress = "0x7e6426Ce9bcB77a549F41b7965a7312b2e882773";
  const riceManagerAddress = "0x408Bdc391CFC10F21e69FDF2Ff6340aC0A0E2dA9";
  const scoreBoardAddress = "0xCD6e99ee39882607F40da5d9f04E1b91F4c43df4";
  const powerUpManagerAddress = "0x77e5734858b72689eA717bc9b16796da6C6841e0";

  // Attacher aux contrats existants
  const AdminController = await ethers.getContractFactory("AdminController");
  const GameRegistry = await ethers.getContractFactory("GameRegistry");
  const RICEManager = await ethers.getContractFactory("RICEManager");
  const ScoreBoard = await ethers.getContractFactory("ScoreBoard");
  const PowerUpManager = await ethers.getContractFactory("PowerUpManager");

  const adminController = AdminController.attach(
    adminControllerAddress
  ).connect(wallet);
  const gameRegistry = GameRegistry.attach(gameRegistryAddress).connect(wallet);
  const riceManager = RICEManager.attach(riceManagerAddress).connect(wallet);
  const scoreBoard = ScoreBoard.attach(scoreBoardAddress).connect(wallet);
  const powerUpManager = PowerUpManager.attach(powerUpManagerAddress).connect(
    wallet
  );

  // ================================
  // CONFIGURE CONTRACT ADDRESSES
  // ================================
  console.log("\n🔗 Configuring contract addresses...");

  // Set contract addresses in GameRegistry
  console.log("📋 Setting contract addresses in GameRegistry...");
  await gameRegistry.setRICEManager(riceManagerAddress);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await gameRegistry.setScoreBoard(scoreBoardAddress);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await gameRegistry.setPowerUpManager(powerUpManagerAddress);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("✅ Contract addresses set in GameRegistry");

  // Set contract addresses in individual contracts
  console.log("🔗 Setting cross-contract references...");

  // Set ScoreBoard address in RICEManager
  await riceManager.setScoreBoardAddress(scoreBoardAddress);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("✅ ScoreBoard address set in RICEManager");

  // Set PowerUpManager address in RICEManager
  await riceManager.setPowerUpManagerAddress(powerUpManagerAddress);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("✅ PowerUpManager address set in RICEManager");

  // Set RICEManager address in ScoreBoard
  await scoreBoard.setRICEManagerAddress(riceManagerAddress);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("✅ RICEManager address set in ScoreBoard");

  // ================================
  // SETUP ADMIN ROLES
  // ================================
  console.log("\n👥 Setting up admin roles...");

  // Set up roles in AdminController
  await adminController.setUserRole(await wallet.getAddress(), 3); // ADMIN role
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("✅ Deployer set as admin");

  // Add game server as operator
  await adminController.setUserRole(await wallet.getAddress(), 1); // OPERATOR role
  await new Promise((resolve) => setTimeout(resolve, 3000));
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
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await scoreBoard.setSecurityKey(securityKey2);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await powerUpManager.setSecurityKey(securityKey3);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("✅ Security keys set");

  // ================================
  // VERIFY CONFIGURATION
  // ================================
  console.log("\n🔍 Verifying configuration...");

  // Verify contract addresses in registry
  const [regRiceManager, regScoreBoard, regPowerUpManager] =
    await gameRegistry.getContractAddresses();
  console.log("📋 Registry contract addresses:");
  console.log("  RICEManager:", regRiceManager);
  console.log("  ScoreBoard:", regScoreBoard);
  console.log("  PowerUpManager:", regPowerUpManager);

  // Verify admin setup
  const deployerRole = await adminController.getUserRole(
    await wallet.getAddress()
  );
  console.log("👥 Deployer role:", deployerRole);

  // ================================
  // CONFIGURATION SUMMARY
  // ================================
  console.log("\n🎉 Configuration completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("  AdminController:", adminControllerAddress);
  console.log("  GameRegistry:", gameRegistryAddress);
  console.log("  RICEManager:", riceManagerAddress);
  console.log("  ScoreBoard:", scoreBoardAddress);
  console.log("  PowerUpManager:", powerUpManagerAddress);

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
    adminController: adminControllerAddress,
    gameRegistry: gameRegistryAddress,
    riceManager: riceManagerAddress,
    scoreBoard: scoreBoardAddress,
    powerUpManager: powerUpManagerAddress,
    securityKeys: {
      riceManager: securityKey1,
      scoreBoard: securityKey2,
      powerUpManager: securityKey3,
    },
  };
}

main()
  .then((result) => {
    console.log("\n✅ Configuration script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Configuration failed:", error);
    process.exit(1);
  });
