import { JsonDB, Config } from "node-json-db";
import admin from "../../modules/firebaseAdmin";
import { aesDecrypt, deriveKeys, verifyHMAC } from "../../modules/encryption";

export default async function handler(req, res) {
  const jsonDB = new JsonDB(
    new Config("./bdd/user-config.json", true, true, "/")
  );
  if (req.method == "POST") {
    if (req.body.idToken) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(req.body.idToken);
        if (req.body.func == "expirationCheck") {
          if (await jsonDB.exists(`/${decodedToken.uid}`)) {
            const userConfig = await jsonDB.getData(`/${decodedToken.uid}`);
            if (userConfig.expiration_date - 120000 < Date.now()) {
              res.status(401).json({ is_expired: true });
            } else {
              res.status(302).json({
                is_expired: false,
                expiration_date: userConfig.expiration_date - 120000,
              });
            }
          } else {
            res.status(401).json({ is_expired: true });
          }
        }

        if (req.body.func == "getUserData") {
          const userConfig = await jsonDB.getData(
            `/${decodedToken.uid}/preferences`
          );
          res.status(200).json(userConfig);
        }

        if (req.body.func == "setClassColor") {
          //maybe overkill but its just a anoying HacKerS blocker
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
            return res
              .status(403)
              .json({
                message: "Message tampered with or HMAC does not match",
              });
          }

          const decyptedSettings = JSON.parse(
            aesDecrypt(encryptedData, aesKey, iv)
          );

          const subject = decyptedSettings.subject;
          const newColor = decyptedSettings.newColor;

          const userConfig = await jsonDB.getData(
            `/${decodedToken.uid}/preferences/class_colors`
          );
          const indexOfSubject = userConfig.findIndex(
            (item) => item.subject == subject
          );
          if (indexOfSubject == -1) {
            await jsonDB.push(
              `/${decodedToken.uid}/preferences/class_colors[]`,
              { subject: subject, color: newColor }
            );
            res.status(200).json({ message: "ok" });
          } else {
            await jsonDB.push(
              `/${decodedToken.uid}/preferences/class_colors[${indexOfSubject}]`,
              { subject: subject, color: newColor }
            );
            res.status(200).json({ message: "ok" });
          }
        }
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Invalid token" });
      }
    } else {
      res.status(400).json({ error: "Invalid data" });
    }
  }
}
