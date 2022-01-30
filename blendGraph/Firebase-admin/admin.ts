import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
dotenv.config();

const path = "./graph-app-add8f-firebase-adminsdk-ipfjp-48d051117e.json";

const environment = process.env.NODE_ENV || "production";

let serviceAccount = require(path);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//export GOOGLE_APPLICATION_CREDENTIALS="/home/node03/dev/frameworks/next/graph/graph-app-backend_02/Firebase-admin/graph-app-add8f-firebase-adminsdk-ipfjp-48d051117e.json"
//admin.initializeApp()

export default admin;
