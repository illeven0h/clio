"use client"
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../firebase/auth";
import Button from "../components/Button";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import your Firebase config


export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null) 
  const { signUp } = useAuth();
  const router = useRouter();

  async function SignupHandler(){
    let role = "user"; 
    if(!username || !email || !password){
      setError("Please fill in all fields");
      return;
    }
    if (email === "admin@gmail.com") {
        role = "admin"; // Assign admin role for specific email
      }

    try{
      await signUp(email, password, username, role);

      console.log(email, role);
      router.push('/home');
    } catch(err) {
      console.error("Error during sign up: ", err);
      setError("Failed to sign up the user. Please try again.");
    }
  }

  return (
    <div className="flex flex-col justify-center min-h-screen py-2 bg-black">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="border-2 border-ivory p-12 rounded-3xl">
          <div><h4 className="text-white text-[30px]">Create an account</h4></div>

          {/* username input */}
          <input 
            className="border-2 text-[12px] bg-black font-body mt-12 text-ivory border-ivory px-4 py-2 w-full rounded-full" 
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username..." 
          />

          {/* Email input */}
          <input 
            className="border-2 text-[12px] bg-black font-body mt-12 text-ivory border-ivory px-4 py-2 w-full rounded-full" 
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address" 
          />
          
          {/* Password input */}
          <input 
            className="border-2 text-[12px] bg-black mt-4 mb-4 font-body text-ivory border-ivory px-4 py-2 w-full rounded-full" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" 
          />
          
          {/* Error message */}
          {error && <p className="text-red-500 text-[11px]">{error}</p>}
          
          <div className="flex flex-col gap-3">
            {/* Continue button */}
            <Button onClick={SignupHandler} text="Continue" />

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
          <p className="pt-3 text-[12px]">Already have an account? <span className="border-b"><Link href="/login">Login</Link></span></p>
        </div>
      </main>
    </div>
  );
}
