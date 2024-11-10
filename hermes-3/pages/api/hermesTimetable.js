import { spawn } from "child_process";
import { aesDecrypt, deriveKeys, verifyHMAC } from "../../modules/encryption";
import admin from "../../modules/firebaseAdmin";
import { JsonDB, Config } from "node-json-db";
import { parseHTML } from "../../components/serverUtils";

const jsonDB = new JsonDB(
  new Config("./bdd/user-config.json", true, true, "/")
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      if (req.body && req.body.idToken) {
        const idToken = req.body.idToken;
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        const userConfig = await jsonDB.getData(`/${decodedToken.uid}`);
        const csrfToken = userConfig.csrftoken;
        const sessionID = userConfig.sessionid;
        const encryptedData = req.body.encryptedData;
        const iv = req.body.iv;
        const hmac = req.body.hmac;
        const salt = req.body.salt;
        const timestamp = Math.floor(Date.now() / 2000);

        const { aesKey, hmacKey } = deriveKeys(
          timestamp,
          salt,
          decodedToken.uid
        );

        if (!verifyHMAC(encryptedData, hmacKey, hmac)) {
          return res.status(403).json({
            message: "Message tampered with or HMAC does not match",
          });
        }

        const decyptedInfos = JSON.parse(aesDecrypt(encryptedData, aesKey, iv));

        const { hermesID, date, setHermesID } = decyptedInfos;

        if (setHermesID) {
          jsonDB.push(`/${decodedToken.uid}/preferences/hermes_id`, hermesID, false);
        }

        const curl = spawn("curl", [
          `https://hermes.edu-vaud.ch/maitres/horaires/?search=${hermesID}&date=${date}&ics=`,
          "-b",
          `csrftoken=${csrfToken}; sessionid=${sessionID}`,
        ]);

        let htmlData = "";

        curl.stdout.on("data", async (data) => {
          htmlData += `${data}`;
        });

        curl.stdout.on("close", async () => {
          const lectureData = parseHTML(htmlData)
          if (JSON.stringify(lectureData) != "[]") {
            res.status(200).json(lectureData);
          } else {
            res.status(404).json({ error: "Not Found" });
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
