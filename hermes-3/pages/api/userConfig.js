import { JsonDB, Config } from "node-json-db";
import admin from "../../modules/firebaseAdmin";

const jsonDB = new JsonDB(
  new Config("./bdd/user-config.json", true, false, "/")
);

export default async function handler(req, res) {
  if (req.method == "POST") {
    if (req.body.idToken) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(req.body.idToken);
        if (req.body.func == "expirationCheck") {
          const userConfig = await jsonDB.getData(`/${decodedToken.uid}`);
          if ((userConfig.expiration_date - 120000 ) < Date.now()) {
            res.status(401).json({ is_expired: true});
          } else {
            res.status(302).json({ is_expired: false })
          } 
        }

      } catch (error) {
        res.status(500).json({ error: "Invalid token" });
      }
    } else {
      res.status(400).json({ error: "Invalid data" });
    }
  }
}
