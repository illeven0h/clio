"use client";
import Link from "next/link";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../firebase/auth";
import { initializeFirebase } from "/firebase/initFirebase";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const { db: firestore } = initializeFirebase();

  // Function to extract username from email
  const getUsernameFromEmail = (email) => {
    return email.split('@')[0]; // Takes everything before the @ symbol
  };

  async function handleAuth() {
    setError(null);
    setIsLoading(true);
    
    // Input validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    
    try {
      if (isLogin) {
        // Login flow
        const userCredential = await login(email, password);
        router.push("/home");
      } else {
        // Sign up flow
        const username = getUsernameFromEmail(email);
        
        // Sign up the user with a standard user role
        await signUp(email, password, username, "user");
        
        // If your signUp function doesn't handle Firestore data creation,
        // uncomment the following code and use it instead
        /*
        // First create the user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Then manually create the Firestore record with the user role
        await setDoc(doc(firestore, "users", user.uid), {
          email: email,
          username: username,
          role: "user",
          createdAt: new Date().toISOString()
        });
        */
        
        router.push("/home");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      // More specific error messages based on Firebase error codes
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError("Invalid email or password.");
      } else if (error.code === 'auth/email-already-in-use') {
        setError("Email is already in use. Please use a different email or login.");
      } else if (error.code === 'auth/weak-password') {
        setError("Password is too weak. Please use a stronger password.");
      } else if (error.code === 'auth/invalid-email') {
        setError("Please enter a valid email address.");
      } else {
        setError(isLogin 
          ? "Failed to log in. Please check your credentials." 
          : "Failed to sign up. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setError(null);
      setIsLoading(true);
      
      const result = await signInWithGoogle();
      
      // Verify we got a valid result with user data
      if (!result || !result.user || !result.user.uid) {
        throw new Error("Failed to get user data from Google sign-in");
      }
      
      const user = result.user;
      console.log("Google sign-in successful for:", user.email);
      
      // Check if this is a new user and add role if needed
      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      
      if (!userDoc.exists()) {
        // Create user document with standard role for new Google users
        console.log("Creating new user document for Google user");
        await setDoc(doc(firestore, "users", user.uid), {
          email: user.email,
          username: user.displayName || getUsernameFromEmail(user.email),
          role: "user",
        });
      }
      
      router.push("/home");
    } catch (err) {
      console.error("Google sign-in error:", err);
      
      // More specific error messages based on the error
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign-in was cancelled. Please try again.");
      } else if (err.code === 'auth/popup-blocked') {
        setError("Pop-up was blocked by your browser. Please allow pop-ups for this site.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError("This domain is not authorized for OAuth operations. Contact the administrator.");
      } else {
        setError(`Failed to sign in with Google: ${err.message || "Please try again."}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex mx-auto justify-center gap-28 items-center min-h-screen">      
      <div className="flex flex-col justify-center min-h-screen py-2 w-1/2">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <div className="border-2 border-grey p-12 rounded-3xl">
            <h1 className="text-grey text-[30px]">{isLogin ? "Welcome back" : "SignUp"}</h1>
            <input 
              className="border-2 border-grey bg-background text-[12px] mt-4 px-4 py-2 w-full rounded-full" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email Address" 
              disabled={isLoading}
            />
            <input 
              className="border-2 border-grey bg-background text-[12px] mt-4 mb-4 px-4 py-2 w-full rounded-full" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password" 
              disabled={isLoading}
            />
            {error && <p className="text-red-500 text-[12px] mb-4">{error}</p>}
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleAuth}
                disabled={isLoading}
                className={`flex items-center justify-center gap-6 border-2 px-6 p-2 rounded-full border-orange text-sm text-black ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange hover:bg-opacity-50'
                }`}
              >
                {isLoading ? "Processing..." : "Continue"}
              </button>
              <div className="flex p-3 items-center gap-4">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="font-semibold">OR</span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>
              <button 
                className={`flex items-center justify-center gap-6 border-2 px-6 p-2 rounded-full border-orange text-sm text-black ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange hover:bg-opacity-50'
                }`}
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              > 
                <Image alt="google icon" src="/google.svg" width={20} height={20} /> 
                <span className="ml-2">Continue with Google</span>
              </button>
            </div>
            <p className="py-2 text-grey text-[12px]">
              {isLogin ? "Don't have an account?" : "Already have an account?"} 
              <span 
                className="border-b underline hover:text-orange font-semibold cursor-pointer ml-1" 
                onClick={() => !isLoading && setIsLogin(!isLogin)}
              >
                {isLogin ? "Signup" : "Login"}
              </span>
            </p>
          </div>
        </main>
      </div>
      <div>
        <Image alt="Auth illustration" src="/login.svg" width={500} height={500} />
      </div>
    </div>
  );
}