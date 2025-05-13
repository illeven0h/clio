"use client";
import { useState, useEffect, createContext, useContext } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { initializeFirebase } from "./initFirebase";

// Initialize Firebase
const { auth, firestore } = initializeFirebase();

// Context Setup
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await getUserRole(user.uid);
        setUserRole(role);
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getUserRole = async (uid) => {
    try {
      let role = null;
      let docRef = doc(firestore, "admins", uid);
      let docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        role = "admin";
      } else {
        docRef = doc(firestore, "users", uid);
        docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          role = "user";
        }
      }

      if (!role) {
        throw new Error("User role not found");
      }
      return role;
    } catch (error) {
      // console.error("Error getting user role:", error);
      throw error;
    }
  };

  const signUp = async (email, password, username, role = "user") => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const collectionName = role === "admin" ? "admins" : "users";
    const userDocRef = doc(firestore, collectionName, user.uid);

    await setDoc(userDocRef, {
      email: user.email,
      username,
      role,
      createdAt: new Date(),
    });

    setCurrentUser(user);
    setUserRole(role);
    return { user, role };
  };

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    const role = await getUserRole(user.uid);
    setCurrentUser(user);
    setUserRole(role);
    return { user, role };
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userDocRef = doc(firestore, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    let role = "user"; // Default role for Google sign-in
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        email: user.email,
        username: user.displayName || user.email.split("@")[0],
        role,
        createdAt: new Date(),
      });
    } else {
      // If user exists, fetch their role
      role = (await getUserRole(user.uid)) || "user";
    }

    setCurrentUser(user);
    setUserRole(role);
    return { user, role };
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, userRole, loading, signUp, login, logout, signInWithGoogle }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};