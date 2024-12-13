// services/firebase.js
import { db } from './firebase';  // Assuming firebase.js is where you set up Firestore
import { doc, getDoc } from 'firebase/firestore';

export const getUserRole = async (userId) => {
  const userRef = doc(db, "users", userId); // "users" collection in Firestore
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return docSnap.data().role;  // Return the user's role (admin/user/guest)
  } else {
    console.log("No such document!");
    return null;
  }
};
