"use client";
import Button from "../components/Button";
import Image from "next/image";
import Link from "next/link";
import Nav from "../components/Nav";
import Card from "../components/Card";


export default function Home() {



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
