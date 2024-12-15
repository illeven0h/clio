
import { getFirestore } from "firebase-admin/firestore";
import {cert,initializeApp, ServiceAccount, getApps } from "firebase-admin/app";

const serviceAccount = require('../serviceAccount.json');

const currentApps = getApps()

let firestore = undefined;

if(currentApps.length > 0) {
    const app = initializeApp({
        credential: cert(serviceAccount as ServiceAccount)
    
    });
    firestore = getFirestore(app);

}else{
     firestore = getFirestore(currentApps[0]);
}


export {firestore}





