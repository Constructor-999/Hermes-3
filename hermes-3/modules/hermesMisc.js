import {
  aesEncrypt,
  deriveKeys,
  generateHMAC,
  generateSalt,
} from "./encryption";

import { databaseSearchEngine } from "../components/utils";

const hermesCSRFexpirationCheck = async (idToken) => {
  const response = await fetch("/api/userConfig", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken, func: "expirationCheck" }),
  });
  const resData = await response.json();
  const is_expired = resData.is_expired;
  if (!is_expired) {
    return { is_expired, expiration_date: resData.expiration_date };
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

      if (response.ok) {
        const hermesBDD = await response.json();
        localStorage.setItem("HermesDB", JSON.stringify(hermesBDD));
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

const getHermesBDD = async (user) => {
  const idToken = await user.getIdToken();
  dispatchEvent(new Event("storage"));
  const response = await fetch("/api/hermesBDD", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });
  const hermesBDD = await response.json();
  localStorage.setItem("HermesDB", JSON.stringify(hermesBDD));
  if (response.status != 429) {
    dispatchEvent(new Event("storage"));
  }
};

const hermesSearch = (searchInput, user) => {
  const hermesBDD = localStorage.getItem("HermesDB");
  if (
    hermesBDD == null ||
    hermesBDD == `{"error":"Too many requests. Please try again later."}`
  ) {
    getHermesBDD(user);
    dispatchEvent(new Event("storage"));
    return [];
  } else {
    return databaseSearchEngine(searchInput, 5, JSON.parse(hermesBDD))
  }
};

const getTimetable = async (user, hermesID, date, setHermesID) => {
  if (user == null) return false;
  const idToken = await user.getIdToken();
  const timestamp = Math.floor(Date.now() / 2000);
  const salt = generateSalt();

  const { aesKey, hmacKey } = deriveKeys(timestamp, salt, user.uid);

  const { encryptedData, iv } = aesEncrypt(
    JSON.stringify({ hermesID, date, setHermesID }),
    aesKey
  );

  const hmac = generateHMAC(encryptedData, hmacKey);

  try {
    const response = await fetch("/api/hermesTimetable", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        encryptedData,
        iv,
        hmac,
        salt,
        idToken,
      }),
    });

    if (response.ok) {
      return response.json();
    } else {
      return "404";
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export { hermesLogin, hermesCSRFexpirationCheck, hermesSearch, getHermesBDD, getTimetable };
