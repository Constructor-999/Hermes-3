import { spawn } from "child_process";
import admin from "../../modules/firebaseAdmin";
import { JsonDB, Config } from "node-json-db";

const ipRequestTimestamps = {};
const RATE_LIMIT_INTERVAL = 5000;

const fetchHermesUserBDD = async (csrfToken, sessionID, res) => {
  const curlBDD = spawn("curl", [
    "https://hermes.edu-vaud.ch/autocomplete/horaire/?q=&forward=%7B%7D",
    "-b",
    `csrftoken=${csrfToken}; sessionid=${sessionID}`,
  ]);

  let searchData = "";

  curlBDD.stdout.on("data", async (data) => {
    searchData += `${data}`;
  });

  curlBDD.stdout.on("close", async () => {
    res.status(200).json(JSON.parse(searchData));
  });
};

const jsonDB = new JsonDB(
  new Config("./bdd/user-config.json", true, true, "/")
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      if (req.body && req.body.idToken) {
        const ip = req.ip;
        const now = Date.now();
        
        if (ipRequestTimestamps[ip]) {
          const lastRequestTime = ipRequestTimestamps[ip];

          if (now - lastRequestTime < RATE_LIMIT_INTERVAL) {
            return res
              .status(429)
              .json({ error: "Too many requests. Please try again later." });
          }
        }

        ipRequestTimestamps[ip] = now;

        const idToken = req.body.idToken;
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userConfig = await jsonDB.getData(`/${decodedToken.uid}`);
        const csrfToken = userConfig.csrftoken;
        const sessionID = userConfig.sessionid;
        await fetchHermesUserBDD(csrfToken, sessionID, res);

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

export { fetchHermesUserBDD };
