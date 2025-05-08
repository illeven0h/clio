"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "../../../firebase/auth";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Role selection during signup
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const getUsernameFromEmail = (email) => email.split("@")[0];

  async function handleAuth() {
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { role } = await login(email, password);
        router.push(role === "admin" ? "/admin" : "/home");
      } else {
        const username = getUsernameFromEmail(email);
        const { role: userRole } = await signUp(email, password, username, role);
        router.push(userRole === "admin" ? "/admin" : "/home");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      const code = error.code;
      if (code === "auth/user-not-found" || code === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else if (code === "auth/email-already-in-use") {
        setError("Email is already in use.");
      } else if (code === "auth/weak-password") {
        setError("Password is too weak.");
      } else if (code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError(isLogin ? "Login failed." : "Signup failed.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setError(null);
      setIsLoading(true);
      const { role } = await signInWithGoogle();
      router.push(role === "admin" ? "/admin" : "/home");
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Admin Button Top-Right */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={() => router.push("/admin")}
          className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-orange-600 text-sm"
        >
          Admin
        </button>
      </div>

      {/* Main Content */}
      <div className="flex mx-auto justify-center gap-28 items-center min-h-screen">
        <div className="flex flex-col justify-center py-2 w-1/2">
          <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
            <div className="border-2 border-grey p-12 rounded-3xl w-full max-w-md">
              <h1 className="text-grey text-[30px] mb-4">
                {isLogin ? "Welcome back" : "Sign Up"}
              </h1>
              <input
                className="border-2 border-grey bg-background text-[12px] mt-2 px-4 py-2 w-full rounded-full"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                disabled={isLoading}
              />
              <input
                className="border-2 border-grey bg-background text-[12px] mt-4 px-4 py-2 w-full rounded-full"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                disabled={isLoading}
              />
              {!isLogin && (
                <select
                  className="border-2 border-grey bg-background text-[12px] mt-4 px-4 py-2 w-full rounded-full"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              )}
              {error && (
                <p className="text-red-500 text-[12px] mt-2 mb-2">{error}</p>
              )}

              <div className="flex flex-col gap-3 mt-4">
                <button
                  onClick={handleAuth}
                  disabled={isLoading}
                  className={`flex items-center justify-center gap-6 border-2 px-6 p-2 rounded-full border-orange text-sm text-black ${
                    isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-orange hover:bg-opacity-50"
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
                    isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-orange hover:bg-opacity-50"
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
    </div>
  );
}
