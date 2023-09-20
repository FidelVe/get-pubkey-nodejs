require("dotenv").config();
const elliptic = require("elliptic");
const { ec } = elliptic;
const ecdsa = new ec("secp256k1");
const base64 = require("base64-js");

const BREAK = "===================================\n";

function validateInputFromEnv(input) {
  if (typeof input !== "string" || input.length === 0) {
    throw new Error("Invalid input");
  }
}
["PRIVATE_KEY", "SIGNATURE", "TX_HASH"].forEach(key => {
  console.log(`Validating input for ${key}`);
  validateInputFromEnv(process.env[key]);
});
console.log(BREAK);

// Input data
const keyPair = ecdsa.keyFromPrivate(process.env.PRIVATE_KEY);
const pubKey = keyPair.getPublic();
const signatureBase64 = process.env.SIGNATURE;
const transactionHashHex = process.env.TX_HASH;

// Convert the base64 signature to a Buffer
const signatureBuffer = Buffer.from(base64.toByteArray(signatureBase64));
const signatureHex = signatureBuffer.toString("hex");
const signatureParsed = signatureHex.match(/([a-f\d]{64})/gi);
const signature = {
  r: signatureParsed[0],
  s: signatureParsed[1]
};

// Convert the transaction hash to a Buffer
const transactionHash = Buffer.from(transactionHashHex, "hex");

// Recover the public key
for (let i = 0; i < 2; i++) {
  const recoveredPublicKey = ecdsa.recoverPubKey(transactionHash, signature, i);
  const recoveredPublicKeyHex = recoveredPublicKey.encode("hex", true);
  console.log("recid:", i);
  console.log("Recovered Public Key:", recoveredPublicKeyHex);
  console.log("Original Public Key:", pubKey.encode("hex").substr(2));
  console.log(
    "Original Public Key (Compressed):",
    pubKey.encodeCompressed("hex")
  );
  console.log(
    `Match found for recid ${i}: ${recoveredPublicKeyHex ===
      pubKey.encodeCompressed("hex")}`
  );
  console.log(BREAK);
}
