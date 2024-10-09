import { spawn } from "child_process";
import {
  aesDecrypt,
  deriveKeys,
  verifyHMAC,
} from "../../modules/encryption";
import admin from "../../modules/firebaseAdmin";
import { JsonDB, Config } from "node-json-db";
 

function parseHttpResponse(responseString) {
  const lines = responseString.trim().split("\n");

  // Parse the status line
  const statusLine = lines[0];
  const [httpVersion, statusCode, ...statusMessage] = statusLine.split(" ");
  const status = statusMessage.join(" ");

  // Initialize the result object
  const result = {
    httpVersion,
    statusCode: Number(statusCode),
    statusMessage: status,
    headers: {},
    cookies: [],
  };

  // Parse the headers
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const [key, value] = line.split(": ");
      if (key.toLowerCase() === "set-cookie") {
        // Parse the cookie value and attributes
        const cookieData = parseCookie(value);
        result.cookies.push(cookieData);
      } else {
        // Otherwise, add it to the headers object
        result.headers[key] = value;
      }
    }
  }

  return result;
}

function parseCookie(cookieString) {
  const cookieParts = cookieString.split(";");
  const [cookieNameValue] = cookieParts[0].split("=");
  const cookieValue = cookieParts[0]
    .substring(cookieNameValue.length + 1)
    .trim();

  const cookieData = {
    name: cookieNameValue,
    value: cookieValue,
    attributes: {},
  };

  // Parse attributes (like expires, max-age, path, etc.)
  for (let i = 1; i < cookieParts.length; i++) {
    const [attributeKey, attributeValue] = cookieParts[i].trim().split("=");
    const key = attributeKey.trim();
    const value = attributeValue ? attributeValue.trim() : true; // If no value, set it to true

    cookieData.attributes[key] = value;
  }

  return cookieData;
}

const jsonDB = new JsonDB(
  new Config("./bdd/user-config.json", true, true, "/")
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      if (
        req.body &&
        req.body.encryptedData &&
        req.body.iv &&
        req.body.hmac &&
        req.body.salt &&
        req.body.idToken
      ) {
        const { encryptedData, iv, hmac, salt, idToken } = req.body;

        const timestamp = Math.floor(Date.now() / 2000);
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        const { aesKey, hmacKey } = deriveKeys(
          timestamp,
          salt,
          decodedToken.uid
        );

        if (!verifyHMAC(encryptedData, hmacKey, hmac)) {
          return res
            .status(403)
            .json({ message: "Message tampered with or HMAC does not match" });
        }

        const decyptedLogin = JSON.parse(aesDecrypt(encryptedData, aesKey, iv));

        //YEAH YEAH I KNOW buuut cURL works soooo
        const curl = spawn("curl", [
          "-i",
          "-X",
          "POST",
          process.env.NEXT_HERMES_LOGIN,
          "-b",
          process.env.NEXT_HERMES_CST,
          "-d",
          `${process.env.NEXT_HERMES_CMWT}&username=${decyptedLogin.email}&password=${decyptedLogin.pass}`,
        ]);
        
        curl.stdout.on("data", async (data) => {
          const parsedResponse = parseHttpResponse(`${data}`);
          if (parsedResponse.statusCode == 302) {
            const csrfToken = parsedResponse.cookies[0].value;
            const sessionID = parsedResponse.cookies[1].value;
            const expirationDate = new Date(parsedResponse.cookies[1].attributes.expires).getTime();

            await jsonDB.push(`/${decodedToken.uid}`, { csrftoken: csrfToken, sessionid: sessionID, expiration_date: expirationDate }, true);

            res.status(200).json({ message: "YAY" });
          } else {
            res.status(500).json({ message: "token not valid" });
          }
        });
      } else {
        res.status(400).json({ error: "Invalid data" });
      }
    } catch (error) {
      console.error("Decryption error:", error);
      res.status(500).json({ error: "Failed to decrypt data" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
