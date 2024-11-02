import { aesEncrypt, deriveKeys, generateHMAC, generateSalt } from "./encryption";

const hermesCSRFexpirationCheck = async (idToken) => {
  const response = await fetch("/api/userConfig", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken, func: "expirationCheck" }),
  });
  const resData = await response.json();
  const is_expired = resData.is_expired
  if (!is_expired) {
    return { is_expired, expiration_date: (resData.expiration_date)}
  }
  return { is_expired, expiration_date: 0 };
};

const hermesLogin = async (user, email, password) => {
  if (user == null) return false;
  const idToken = await user.getIdToken();
  const CSRFexpired = (await hermesCSRFexpirationCheck(idToken)).is_expired;

  if (CSRFexpired && email == "" && password == "") return false;

  if (CSRFexpired) {
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


const hermesSearch = async (searchInput, idToken) => {

};

export { hermesLogin, hermesCSRFexpirationCheck, hermesSearch };