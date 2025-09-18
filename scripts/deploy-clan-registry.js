/* eslint-disable no-console */
const hre = require("hardhat");

// Deploy ClanRegistry and seed clans.
// Env:
//  - OWNER (optional): owner address; defaults to deployer
//  - UPDATER (optional): address to grant updater role
//  - VERIFY (optional): "1" to verify on explorer
async function main() {
  const { ethers, run } = hre;
  const [deployer] = await ethers.getSigners();

  const owner = process.env.OWNER || deployer.address;
  const updater = process.env.UPDATER;
  const shouldVerify = process.env.VERIFY === "1";

  console.log("Deployer:", deployer.address);
  console.log("Owner:", owner);

  const ClanRegistry = await ethers.getContractFactory("ClanRegistry");
  const registry = await ClanRegistry.deploy(owner);
  await registry.waitForDeployment();

  const registryAddress = await registry.getAddress();
  console.log("ClanRegistry deployed:", registryAddress);

  const clans = [
    { id: "akaTora", name: "Aka Tora" },
    { id: "aoiTsuru", name: "Aoi Tsuru" },
    { id: "midoriRyuu", name: "Midori Ryuu" },
    { id: "koganeKitsune", name: "Kogane Kitsune" },
  ];

  for (const c of clans) {
    const clanId = ethers.keccak256(ethers.toUtf8Bytes(c.id));
    const tx = await registry.addClan(clanId, c.name);
    await tx.wait();
    console.log("Added clan:", c.name, clanId);
  }

  if (updater) {
    const tx = await registry.setUpdater(updater, true);
    await tx.wait();
    console.log("Granted updater:", updater);
  }

  if (shouldVerify) {
    await new Promise((r) => setTimeout(r, 6000));
    try {
      await run("verify:verify", {
        address: registryAddress,
        constructorArguments: [owner],
      });
      console.log("Verified ClanRegistry");
    } catch (err) {
      console.warn("Verification failed:", err.message || err);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
