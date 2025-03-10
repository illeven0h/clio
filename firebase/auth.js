"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { doc, setDoc } from "firebase/firestore";
import { initializeFirebase } from "../firebase/initFirebase";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

// Create Auth Context
const AuthContext = createContext();
const { auth, firestore } = initializeFirebase();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email, password, username, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user to Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        email: user.email,
        username,
        role,
        createdAt: new Date(),
      });

      return user;
    } catch (error) {
      console.error("Error during sign-up:", error);
      throw error;
    }
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setCurrentUser(result.user);
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  const logout = () => signOut(auth);

  const value = {
    currentUser,
    loading,
    signUp,
    signInWithGoogle,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
