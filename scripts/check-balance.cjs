const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  const address = await signer.getAddress();
  const balance = await ethers.provider.getBalance(address);
  
  console.log("📊 Account Information:");
  console.log("Address:", address);
  console.log("Balance:", ethers.formatEther(balance), "RISE");
  
  if (balance === 0n) {
    console.log("\n⚠️  No funds detected!");
    console.log("💡 Get RISE testnet tokens from:");
    console.log("   https://testnet.riselabs.xyz/faucet");
    console.log("   Or use a different account with funds");
  } else {
    console.log("\n✅ Sufficient funds for deployment");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 