import { getFirestore } from "firebase-admin/firestore";
import { cert, initializeApp, getApps } from "firebase-admin/app";

const serviceAccount = require('../serviceAccount.json');

let firestore = undefined;

// Initialize Firebase if no app is initialized yet
if (getApps().length === 0) {

    const app = initializeApp({
        credential: cert(serviceAccount)
    });
    firestore = getFirestore(app);
} else {
    // Use the existing initialized app
    firestore = getFirestore();
}

export { firestore };
