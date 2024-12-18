"use client";
import Link from "next/link";
import { doc,getDoc } from "firebase/firestore";
import Button from "../components/Button";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../firebase/auth";
import { initializeFirebase } from "/firebase/initFirebase";

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null) 
  const {login, currentUser} = useAuth();
  const { signInWithGoogle } = useAuth();
  const {firestore} = initializeFirebase()
  const router = useRouter();
  
  async function LoginHandler() {
    try {
      const userCredential = await login(email, password); 
      const user = userCredential.user;
  
      // Fetch role from Firestore using the user's UID
      const userDoc = await getDoc(doc(firestore, "users", user.uid));
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;
  
        // Redirect based on role
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else if (role === "user") {
          router.push("/home");
        }
      } else {
        console.error("No user data found in Firestore!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Failed to log in. Please check your credentials.");
    }
  }
  
 
  return (
    <div className="flex flex-col justify-center min-h-screen py-2 bg-black">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="border-2 border-ivory p-12 rounded-3xl">
          <div>
            <h4 className="text-white text-[30px]">Welcome back</h4>
          </div>
          <input
            className="border-2 text-[12px] bg-black font-body mt-12 text-ivory border-ivory px-4 py-2 w-full rounded-full"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Bind the state here
            placeholder="Email Address"
          />
          <input
            className="border-2 text-[12px] bg-black mt-4 mb-4 font-body text-ivory border-ivory px-4 py-2 w-full rounded-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Bind the state here
            placeholder="Password"
          />
          
          {error && <p className="text-red-500 text-[12px]">{error}</p>}
          

          <div className="flex flex-col gap-3">
            <Button
            onClick={LoginHandler}
            text="Continue"></Button>
            <div className="flex p-3 items-center gap-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span>OR</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            <Button 
            onClick={async () => {
              try {
                await signInWithGoogle();
              } catch (err) {
                setError("Failed to sign in with Google");
              }
            }}
            
            text="Continue with google">
              <Image
                alt="google icon"
                src="/google.svg"
                width={24}
                height={24}
              />
            </Button>
          </div>
          <p className="py-2 text-[12px]">
            Don't have an account?{" "}
            <span className="border-b">
              <Link href="/signup">Signup</Link>
            </span>
          </p>

        </div>
      </main>
    </div>
  );
}
