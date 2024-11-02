import { aesEncrypt, deriveKeys, generateHMAC, generateSalt} from "./encryption";

const getClassColors = async (idToken) => {
  const response = await fetch("/api/userConfig", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken, func: "getClassColors" }),
  });
  if (response.ok) {
    return response.json()
  } else {
    return [];
  }
};

const setClassColor = async (user, subject, newColor) => {
  if (user == null) return false;
  const idToken = await user.getIdToken();
  const timestamp = Math.floor(Date.now() / 2000);
  const salt = generateSalt();

  const { aesKey, hmacKey } = deriveKeys(timestamp, salt, user.uid);

  const { encryptedData, iv } = aesEncrypt(
    JSON.stringify({ subject: subject, newColor: newColor }),
    aesKey
  );

  const hmac = generateHMAC(encryptedData, hmacKey);

  try {
    const response = await fetch("/api/userConfig", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ encryptedData, iv, hmac, salt, idToken, func: "setClassColor" }),
    });

    // Check if the response is OK and content type is JSON
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const hermesUserDB = async (searchInput, idToken) => {};

export { getClassColors, setClassColor }