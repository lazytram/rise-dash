import { ethers } from "ethers";
import fs from "fs";
import path from "path";

async function generateKeys() {
  console.log("🔑 Generating keys for the security system...\n");

  // Generate a new private key for the game owner
  const gameOwnerWallet = ethers.Wallet.createRandom();

  // Generate a random security key
  const securityKey = ethers.randomBytes(32);

  console.log("✅ Keys generated successfully !\n");

  console.log("📋 Game owner information :");
  console.log(`   Address: ${gameOwnerWallet.address}`);
  console.log(`   Private key: ${gameOwnerWallet.privateKey}`);
  console.log(`   Mnemonic phrase: ${gameOwnerWallet.mnemonic.phrase}\n`);

  console.log("🔐 Security key :");
  console.log(`   ${ethers.hexlify(securityKey)}\n`);

  // Create the .env file content
  const envContent = `# Game owner private key (for signing scores)
NEXT_PUBLIC_GAME_OWNER_PRIVATE_KEY=${gameOwnerWallet.privateKey}

# Security key for the contract
NEXT_PUBLIC_SECURITY_KEY=${ethers.hexlify(securityKey)}

# API key for contract verification (optional)
ETHERSCAN_API_KEY=NOT_REQUIRED

# Hardhat configuration
PRIVATE_KEY=${gameOwnerWallet.privateKey}
`;

  // Write to the .env file
  const envPath = path.join(process.cwd(), ".env");
  fs.writeFileSync(envPath, envContent);

  console.log("📁 .env file created with the generated keys !");
  console.log(`   Path: ${envPath}\n`);

  console.log("⚠️  IMPORTANT :");
  console.log("   1. Keep these keys secure");
  console.log("   2. Never share the private key");
  console.log("   3. Backup the mnemonic phrase");
  console.log("   4. Make sure you have funds on the address for deployment\n");

  console.log("🚀 Next steps :");
  console.log("   1. Verify that the .env file has been created");
  console.log("   2. Make sure you have RISE funds on the address");
  console.log("   3. Run: npm run compile:contract");
  console.log("   4. Run: npm run deploy:contract");

  return {
    gameOwnerAddress: gameOwnerWallet.address,
    gameOwnerPrivateKey: gameOwnerWallet.privateKey,
    securityKey: ethers.hexlify(securityKey),
  };
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateKeys()
    .then(() => {
      console.log("\n✅ Generation completed !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error during generation :", error);
      process.exit(1);
    });
}

export { generateKeys };
