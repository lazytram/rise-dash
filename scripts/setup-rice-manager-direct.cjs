const { ethers } = require("hardhat");

async function main() {
  console.log("🌾 Setting up RICEManager address directly...");

  // Get the signer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Using address:", deployer.address);

  // Contract addresses
  const scoreBoardAddress = "0x16360957eF50d2a754c76a16B833d5A1D2c437Cb";
  const riceManagerAddress = "0xA19E2a7730bADf428601042b707E4727B26Cc726";

  console.log("📋 ScoreBoard address:", scoreBoardAddress);
  console.log("🌾 RICEManager address:", riceManagerAddress);

  // Get the ScoreBoard contract
  const ScoreBoard = await ethers.getContractFactory("ScoreBoard");
  const scoreBoard = ScoreBoard.attach(scoreBoardAddress);

  console.log("📋 Setting RICEManager address...");

  try {
    // Call setRICEManagerAddress directly
    const tx = await scoreBoard.setRICEManagerAddress(riceManagerAddress);
    console.log("🔗 Transaction hash:", tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed in block:", receipt.blockNumber);

    // Check if the transaction was successful
    if (receipt.status === 1) {
      console.log("✅ RICEManager address set successfully!");
    } else {
      console.log("❌ Transaction failed!");
    }
  } catch (error) {
    console.error("❌ Error setting RICEManager address:", error.message);

    // Check if it's a permission error
    if (error.message.includes("Only game owner")) {
      console.log("❌ You are not the game owner!");
    }
  }

  console.log("\n📋 Next steps:");
  console.log("1. Test the recordScoreWithRICE function");
  console.log("2. Verify RICE rewards are being added correctly");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
