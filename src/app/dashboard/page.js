"use client";
import Image from "next/image";
import React, { useState } from "react";
import Nav from "../components/Nav"

export default function DashboardUser() {
  return (
        <>
        <Nav className="mt-4" clioClassName ="text-black mt-2 ml-8" logoutClassName="mt-3 mr-8" />
        <div className="h-screen flex flex-col justify-center items-center relative">

        {/* Background Image */}
        <Image
          src="/images/Union.svg"
          alt="Polygon Background"
          layout="fill"
          objectFit="contain"
          className="absolute z-[-1] p-4"
        />
  


        
        <h4 className=" text-black text-2xl">User Dashboard</h4>
        </div>
      
      </>
  );
}
