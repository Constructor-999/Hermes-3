import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync(process.env.NEXT_PROVATE_FIREBASE_ADMIN_PATH, "utf-8")
); // Ensure you have your service account key in your environment variables

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
