const { ethers } = require("hardhat");

async function main() {
  console.log("🔐 Setting up security key for ScoreBoard contract...");

  // Get the signer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Using address:", deployer.address);

  // Contract address (update this with your deployed contract address)
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.error("❌ CONTRACT_ADDRESS environment variable not set");
    console.log(
      "💡 Set CONTRACT_ADDRESS in your .env file or pass it as an argument"
    );
    process.exit(1);
  }

  // Security key (generate a random one if not provided)
  const securityKey = process.env.SECURITY_KEY || ethers.randomBytes(32);
  console.log("🔑 Security key:", ethers.hexlify(securityKey));

  // Get the contract
  const ScoreBoard = await ethers.getContractFactory("ScoreBoard");
  const scoreBoard = ScoreBoard.attach(contractAddress);

  console.log("📋 Setting security key...");

  try {
    const tx = await scoreBoard.setSecurityKey(securityKey);
    await tx.wait();

    console.log("✅ Security key set successfully!");
    console.log("🔗 Transaction hash:", tx.hash);

    // Verify the security key was set
    const contractInfo = await scoreBoard.getContractInfo();
    console.log("📊 Contract info:");
    console.log("   - Game Owner:", contractInfo[0]);
    console.log("   - Paused:", contractInfo[1]);
    console.log("   - Min Time Between Scores:", contractInfo[2].toString());
    console.log("   - Security Key Set:", contractInfo[3]);
  } catch (error) {
    console.error("❌ Error setting security key:", error.message);
    process.exit(1);
  }

  console.log("\n📋 Next steps:");
  console.log("1. Update NEXT_PUBLIC_SECURITY_KEY in your .env file");
  console.log("2. Make sure the game owner private key is configured");
  console.log("3. Test the contract with a score submission");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error during setup:", error);
    process.exit(1);
  });
