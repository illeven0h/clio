"use client";
import Link from "next/link";
import Button from "../components/Button";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null) 
  const {login, currentUser} = useAuth();
  const router = useRouter();

  console.log(currentUser)

  async function LoginHandler(){
    if(!email || !password){
      setError("Please fill in all fields")
      return
    }

    try{
     await login(email, password)
     router.push('/home')
    }catch(err){
      setError("failed to login the user")
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

            <Button text="Continue with google">
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

          <p className="text-[12px] ">
            For admin -{" "}
            <span className="border-b">
              <Link href="/admin/login">Login</Link>
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
