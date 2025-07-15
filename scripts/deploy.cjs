const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying ScoreBoard contract on RISE Testnet...");

  // Get the signer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with address:", deployer.address);

  // Compile and deploy the contract
  const ScoreBoard = await ethers.getContractFactory("ScoreBoard");
  const scoreBoard = await ScoreBoard.deploy();

  await scoreBoard.waitForDeployment();
  const address = await scoreBoard.getAddress();

  console.log("✅ ScoreBoard contract deployed at address:", address);
  console.log(
    "🔗 Explorer:",
    `https://explorer.testnet.riselabs.xyz/address/${address}`
  );

  // Verify the contract (optional - requires ETHERSCAN_API_KEY)
  if (
    process.env.ETHERSCAN_API_KEY &&
    process.env.ETHERSCAN_API_KEY !== "NOT_REQUIRED"
  ) {
    console.log("🔍 Verifying contract...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.log("⚠️ Error during verification:", error.message);
    }
  } else {
    console.log(
      "ℹ️ Skipping contract verification (ETHERSCAN_API_KEY not provided)"
    );
    console.log(
      "💡 To verify the contract, add ETHERSCAN_API_KEY to your .env file"
    );
  }

  console.log("\n📋 Important information:");
  console.log(
    "1. Update the contract address in src/services/blockchainService.ts"
  );
  console.log("2. Make sure your wallet has RISE funds for transactions");
  console.log("3. Test the contract with a small transaction first");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error during deployment:", error);
    process.exit(1);
  });
