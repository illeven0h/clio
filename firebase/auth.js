"use client";

import React, { useState, useEffect, useContext, createContext } from "react";
import nookies from "nookies";
import { initializeFirebase } from "/firebase/initFirebase"; // Updated import

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const { auth } = initializeFirebase();  // Call the function to get auth service

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        nookies.set(undefined, "token", "", {});
        return;
      }

      const token = await user.getIdToken();
      setUser(user);
      nookies.set(undefined, "token", token, {});
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, [auth]); // Depend on auth service to avoid re-initialization

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

// Custom Hook to Use Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};
