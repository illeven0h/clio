"use client";
import React, { useState, useEffect } from "react";
import { auth } from "/src/config/firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import Button from "../components/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  // State hooks for email, password, and error message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/home');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up:", userCredential.user);
      alert("Sign-up successful!");
      
      // Clear input fields
      setEmail('');
      setPassword('');
      
      // The redirection should happen in the useEffect after successful authentication
    } catch (err) {
      console.error("Error signing up:", err.message);
      setError("An error occurred during sign-up. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen py-2 bg-black">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="border-2 border-ivory p-12 rounded-3xl">
          <div><h4 className="text-white text-[30px]">Create an account</h4></div>

          {/* Email input */}
          <input 
            className="border-2 text-[12px] bg-black font-body mt-12 text-ivory border-ivory px-4 py-2 w-full rounded-full" 
            type="email"
            id="email"
            value={email} // Bind state to input
            onChange={(e) => setEmail(e.target.value)} // Handle input change
            placeholder="Email Address" 
          />
          
          {/* Password input */}
          <input 
            className="border-2 text-[12px] bg-black mt-4 mb-4 font-body text-ivory border-ivory px-4 py-2 w-full rounded-full" 
            type="password"
            value={password} // Bind state to input
            onChange={(e) => setPassword(e.target.value)} // Handle input change
            placeholder="Password" 
          />
          
          {/* Error message */}
          {error && <p className="text-red-500 text-[11px]">{error}</p>}
          
          <div className="flex flex-col gap-3">
            {/* Continue button */}
            <Button onClick={handleEmailSignUp} text="Continue"></Button>

            <div className="flex p-3 items-center gap-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span>OR</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            {/* Google sign-up button */}
            <Button text="Continue with Google"> 
              <Image alt="google icon" src="/google.svg" width={24} height={24} />
            </Button>
          </div>
          <p className="pt-3 text-[12px]">already have an account? <span className="border-b"><Link href="/login">Login</Link></span></p>
          <p className="text-[12px] pt-3">For admin - <span className="border-b"><Link href="/admin/login">Login</Link></span></p>
        </div>
      </main>
    </div>
  );
}
