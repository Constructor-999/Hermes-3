import { randomBytes, createHmac, createCipheriv, createDecipheriv } from "crypto";

// Generates a random salt
const generateSalt = () => randomBytes(16).toString("hex");

// Derives AES and HMAC keys on the client side using timestamp and UID (without master_secret)
const deriveKeys = (timestamp, salt, userUID) => {
  const baseKey = `${timestamp}${salt}${userUID}`;
  const hmac = createHmac("sha256", baseKey);
  const derivedKey = hmac.digest("hex");

  // Ensure keys are the correct length
  const aesKey = derivedKey.slice(0, 64); // First 32 hex characters for AES key (16 bytes)
  const hmacKey = derivedKey.slice(64);   // Remaining for HMAC key (32 hex characters, 16 bytes)

  return { aesKey, hmacKey };
};

// Client-side AES Encryption
const aesEncrypt = (data, aesKey) => {
  const iv = randomBytes(16); // Generate a random IV
  const cipher = createCipheriv("aes-256-cbc", Buffer.from(aesKey, "hex"), iv);

  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");

  return { encryptedData: encrypted, iv: iv.toString("base64") };
};

// Client-side HMAC generation
const generateHMAC = (data, hmacKey) => {
  const hmac = createHmac("sha256", Buffer.from(hmacKey, "hex"));
  hmac.update(data);
  return hmac.digest("hex");
};

// Decrypt the AES encrypted data on the server side
const aesDecrypt = (encryptedData, aesKey, iv) => {
  const decipher = createDecipheriv(
    "aes-256-cbc",
    Buffer.from(aesKey, "hex"),
    Buffer.from(iv, "base64")
  );

  let decrypted = decipher.update(encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

// Verify HMAC on the server side
const verifyHMAC = (data, hmacKey, receivedHmac) => {
  const hmac = createHmac("sha256", Buffer.from(hmacKey, "hex"));
  hmac.update(data);

  const calculatedHmac = hmac.digest("hex");
  return calculatedHmac === receivedHmac;
};


export { generateSalt, deriveKeys, aesEncrypt, generateHMAC, aesDecrypt, verifyHMAC }