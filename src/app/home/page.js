"use client";
import Button from "../components/Button";
import Image from "next/image";
import Link from "next/link";
import Nav from "../components/Nav";
import Card from "../components/Card";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authContext';

export default function Home() {
  // const { user, logout } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   console.log("User:", user); // Log the user state
  //   if (!user) {
  //     router.push('/'); // Redirect to landing page if not authenticated
  //   }
  // }, [user, router]);

  // if (!user) return null; // Render nothing if no user is logged in

  const handleLogout = () => {
    logout(); // Call logout function from context
    router.push('/'); // Redirect to landing page
  };

  return (
    <>
      <Nav />
      <div className="h-screen overflow-y-scroll flex flex-col justify-center items-center relative">

        <div><h4 className="mt-[200px] text-bone text-[32px]">Spotlight</h4></div>

        <div className="min-h-screen p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
        </div>
      </div>
    </>
  );
}
