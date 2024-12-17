"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { doc, setDoc} from "firebase/firestore";
import { initializeFirebase } from "/firebase/initFirebase";  // Import your Firebase initialization function
import { getAuth,GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,signInWithPopup, signOut } from "firebase/auth";

// Create Auth Context
const AuthContext = createContext();
const { firestore } = initializeFirebase();

// Auth Provider Component
export function useAuth() {
  return useContext(AuthContext);
} 

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { auth } = initializeFirebase(); // Get auth from Firebase initialization
  


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [auth]);

  const signUp = async (email, password, username, role) => {
    try {
      // Create the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Write user data to Firestore
      try {
        await setDoc(doc(firestore, "users", user.uid), {
          email: user.email,
          username,
          role,
        });
      } catch (firestoreError) {
        console.error("Error writing document: ", firestoreError);
        throw firestoreError; // Propagate error for further handling
      }
  
      return user;
    } catch (error) {
      // Handle authentication errors
      if (error.code === 'auth/email-already-in-use') {
        console.error("Email is already in use.");
      } else {
        console.error("Failed to sign up. Please try again.");
      }
      console.error("Error during sign-up:", error);
      throw error; // Propagate error for further handling
    }
  };
  
  
  //assigning the roles to the us

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // You can perform additional logic here, such as saving user info to Firestore
      setCurrentUser(user);

    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    loading,
    signUp,
    signInWithGoogle,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};
