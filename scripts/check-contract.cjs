const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking ScoreBoard contract state...");

  // Get the signer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Using address:", deployer.address);

  // Contract address
  const scoreBoardAddress = "0x307f7bd501a069db18099CD5Fa315Bf242Bba06A";

  console.log("📋 ScoreBoard address:", scoreBoardAddress);

  // Get the ScoreBoard contract
  const ScoreBoard = await ethers.getContractFactory("ScoreBoard");
  const scoreBoard = ScoreBoard.attach(scoreBoardAddress);

  try {
    // Get contract info
    const contractInfo = await scoreBoard.getContractInfo();
    console.log("📊 Contract info:");
    console.log("   - Game Owner:", contractInfo[0]);
    console.log("   - Paused:", contractInfo[1]);
    console.log("   - Min Time Between Scores:", contractInfo[2].toString());
    console.log("   - Security Key Set:", contractInfo[3]);

    // Check if deployer is game owner
    const isGameOwner = contractInfo[0] === deployer.address;
    console.log("👑 Is deployer game owner?", isGameOwner);

    // Get RICEManager address
    const riceManagerAddress = await scoreBoard.riceManagerAddress();
    console.log("🌾 Current RICEManager address:", riceManagerAddress);

    if (riceManagerAddress === "0x0000000000000000000000000000000000000000") {
      console.log("❌ RICEManager not configured!");

      if (isGameOwner) {
        console.log(
          "✅ You are the game owner. You can configure RICEManager."
        );
      } else {
        console.log(
          "❌ You are not the game owner. Cannot configure RICEManager."
        );
      }
    } else {
      console.log("✅ RICEManager is configured!");
    }
  } catch (error) {
    console.error("❌ Error checking contract:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
