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
import { doc, getDoc, setDoc } from "firebase/firestore";
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
      const adminDocRef = doc(firestore, "admins", uid);
      const adminDocSnap = await getDoc(adminDocRef);

      if (adminDocSnap.exists()) {
        role = "admin";
      } else {
        const userDocRef = doc(firestore, "users", uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          role = "user";
        }
      }

      if (!role) {
        throw new Error("User role not found");
      }
      return role;
    } catch (error) {
      console.error("Error getting user role:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    // Validate admin credentials
    if (email === "admin@gmail.com" && password === "admin@1234") {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const role = await getUserRole(user.uid);
      if (role !== "admin") {
        throw new Error("Access denied: Not an admin account");
      }
      setCurrentUser(user);
      setUserRole(role);
      return { user, role };
    } else {
      // Regular user login
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const role = await getUserRole(user.uid);
      if (role === "admin") {
        throw new Error("Use admin credentials for admin login");
      }
      setCurrentUser(user);
      setUserRole(role);
      return { user, role };
    }
  };

  const signUp = async (email, password, username) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const role = "user"; // Default role for all signups
    const userDocRef = doc(firestore, "users", user.uid);

    await setDoc(userDocRef, {
      email: user.email,
      username,
      role,
      createdAt: new Date(),
      preferences: {},
    });

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

    let role = "user";
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        email: user.email,
        username: user.displayName || user.email.split("@")[0],
        role,
        createdAt: new Date(),
        preferences: {},
      });
    } else {
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