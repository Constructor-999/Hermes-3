import { aesEncrypt, deriveKeys, generateHMAC, generateSalt } from "./encryption";

const hermesLogin = async (user, email, password) => {
  if (user == null) return false;
  const idToken = await user.getIdToken();
  const response = await fetch("/api/userConfig", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken, func: "expirationCheck" }),
  });
  const resData = await response.json();

  if (resData.is_expired && email == "" && password == "") return false;

  if (resData.is_expired) {
    const timestamp = Math.floor(Date.now() / 2000);
    const salt = generateSalt();

    const { aesKey, hmacKey } = deriveKeys(timestamp, salt, user.uid);

    const { encryptedData, iv } = aesEncrypt(
      JSON.stringify({ email: email, pass: password }),
      aesKey
    );

    const hmac = generateHMAC(encryptedData, hmacKey);

    try {
      const response = await fetch("/api/hermesLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ encryptedData, iv, hmac, salt, idToken }),
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
  } else {
    return true;
  }
};

export { hermesLogin };
