"use client";
import Link from "next/link";
import Nav from "./components/Nav.js";
import Image from "next/image";
import Button from "./components/Button.js";
import { useAuth } from "/firebase/auth";
import { useRouter } from "next/navigation";


export default function LandingPage() {
    const {currentUser} = useAuth()
    const router = useRouter()

  if(currentUser) {
    router.push('/home')
   }


  return (
    <>
    <div className="h-screen flex flex-col justify-center items-center relative">

      {/* Background Image */}
      <Image
        src="/images/Union.svg"
        alt="Polygon Background"
        layout="fill"
        objectFit="contain"
        className="absolute z-[-1] p-4"
      />

      {/* Top Section */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-[90%] top-0 flex justify-between items-center h-[100px] 2xl:px-16 px-4">
        <Link href="/">
          <h4 className="text-3xl cursor-pointer text-black">Clio</h4>
        </Link>
        <Link href= "/login">
        <Button text = "login" ></Button>
        </Link>
      </div>

      {/* Content Wrapper */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 w-[80%] max-w-screen-xl mx-auto text-center lg:text-left">
        <div className="text-wrapper">
          <h1 className="text-black text-4xl leading-tight">Next Gen Marketing Assistant</h1>
          <p className="text-gray-600 font-[Michroma] text-lg mb-2">
            Step into the future of marketing
          </p>
          <Link href = "/spotlight">
          <Button text ="Spotlight"></Button>
          </Link>
        </div>
        <Image
          src="/images/illustration_LP.svg"
          alt="Illustration"
          height={400}
          width={300}
          className="lg:w-auto w-[90%]"
        />
      </div>
    </div>
    </>
  );
}
