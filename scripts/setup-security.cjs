const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🔐 Configuration sécurisée des clés...");

  // Générer les clés de sécurité
  const securityKeys = {
    RICE_MANAGER: ethers.keccak256(
      ethers.toUtf8Bytes("RICE_MANAGER_SECURITY_KEY")
    ),
    SCORE_BOARD: ethers.keccak256(
      ethers.toUtf8Bytes("SCOREBOARD_SECURITY_KEY")
    ),
    POWER_UP_MANAGER: ethers.keccak256(
      ethers.toUtf8Bytes("POWERUP_MANAGER_SECURITY_KEY")
    ),
  };

  // Créer le fichier de configuration serveur
  const serverConfig = {
    securityKeys,
    deploymentInfo: {
      timestamp: new Date().toISOString(),
      network: "riseTestnet",
      note: "⚠️ NE JAMAIS PARTAGER CES CLÉS - UTILISATION SERVEUR UNIQUEMENT",
    },
  };

  // Sauvegarder dans un fichier sécurisé (à ajouter au .gitignore)
  const configPath = path.join(__dirname, "../.env.server");
  fs.writeFileSync(configPath, JSON.stringify(serverConfig, null, 2));

  console.log("✅ Configuration serveur sauvegardée dans .env.server");
  console.log("⚠️  IMPORTANT: Ajoutez .env.server à votre .gitignore");
  console.log(
    "⚠️  IMPORTANT: Ces clés ne doivent JAMAIS être exposées côté client"
  );

  // Afficher les clés pour configuration serveur
  console.log("\n🔑 Clés de sécurité pour votre serveur:");
  console.log("RICE_MANAGER_KEY:", securityKeys.RICE_MANAGER);
  console.log("SCORE_BOARD_KEY:", securityKeys.SCORE_BOARD);
  console.log("POWER_UP_MANAGER_KEY:", securityKeys.POWER_UP_MANAGER);

  console.log("\n📝 Instructions pour votre serveur:");
  console.log("1. Ajoutez ces clés à vos variables d'environnement serveur");
  console.log(
    "2. Utilisez-les uniquement pour signer les transactions côté serveur"
  );
  console.log("3. Ne les exposez JAMAIS dans le frontend ou les logs");
  console.log(
    "4. Stockez-les de manière sécurisée (AWS Secrets Manager, etc.)"
  );

  return serverConfig;
}

main()
  .then(() => {
    console.log("\n✅ Configuration de sécurité terminée");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  });
