"use client";
import Link from "next/link";
import Button from "../components/Button";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../firebase/auth";

export default function DashboardUser() {

  return (
    <div className="flex flex-col justify-center min-h-screen py-2 bg-black">
      dashboard page for users
    </div>
  );
}
