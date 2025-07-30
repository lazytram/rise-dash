// Configuration de sécurité côté serveur
// ⚠️ ATTENTION: Ces clés ne doivent JAMAIS être exposées côté client

export const SERVER_SECURITY_CONFIG = {
  // Clés de sécurité pour les contrats (à récupérer depuis les variables d'environnement)
  RICE_MANAGER_KEY:
    process.env.RICE_MANAGER_KEY ||
    "0x80ddc7b2447c81e4e8cda5d6c473342ac484f3b33152ae6e082549712410a610",
  SCORE_BOARD_KEY:
    process.env.SCORE_BOARD_KEY ||
    "0x190532addf1e1153886ddb2f3b9fe8376cc29efd15a91da5610c6ba191c7298b",
  POWER_UP_MANAGER_KEY:
    process.env.POWER_UP_MANAGER_KEY ||
    "0xc83698e59ebb4416fdd7907ba49d1da1994f5be4bf5bddfd8f0b101008ebd872",

  // Adresses des contrats déployés
  CONTRACT_ADDRESSES: {
    ADMIN_CONTROLLER: "0x78ee7dA36f5D32054781dAFCD06476636c093d4d",
    GAME_REGISTRY: "0x7e6426Ce9bcB77a549F41b7965a7312b2e882773",
    RICE_MANAGER: "0x408Bdc391CFC10F21e69FDF2Ff6340aC0A0E2dA9",
    SCORE_BOARD: "0xCD6e99ee39882607F40da5d9f04E1b91F4c43df4",
    POWER_UP_MANAGER: "0x77e5734858b72689eA717bc9b16796da6C6841e0",
  },

  // Validation des clés au démarrage
  validateKeys() {
    const requiredKeys = [
      this.RICE_MANAGER_KEY,
      this.SCORE_BOARD_KEY,
      this.POWER_UP_MANAGER_KEY,
    ];

    const missingKeys = requiredKeys.filter(
      (key) =>
        !key ||
        key ===
          "0x0000000000000000000000000000000000000000000000000000000000000000"
    );

    if (missingKeys.length > 0) {
      console.warn("⚠️ Some security keys are missing or invalid");
      return false;
    }

    return true;
  },
};

// Fonction pour signer les messages côté serveur
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const signServerMessage = async (
  _message: string,
  _contractType: "rice" | "score" | "powerup"
): Promise<string> => {
  // Cette fonction doit être implémentée côté serveur
  // Elle utilise les clés privées pour signer les messages
  // Exemple d'implémentation avec ethers.js :

  /*
  import { ethers } from 'ethers';

  const getKeyForContract = (contractType: string) => {
    switch (contractType) {
      case 'rice': return SERVER_SECURITY_CONFIG.RICE_MANAGER_KEY;
      case 'score': return SERVER_SECURITY_CONFIG.SCORE_BOARD_KEY;
      case 'powerup': return SERVER_SECURITY_CONFIG.POWER_UP_MANAGER_KEY;
      default: throw new Error('Invalid contract type');
    }
  };

  const privateKey = getKeyForContract(contractType);
  const wallet = new ethers.Wallet(privateKey);
  const messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
  const signature = await wallet.signMessage(ethers.getBytes(messageHash));

  return signature;
  */

  throw new Error("signServerMessage must be implemented server-side");
};
