"use client";
import Link from "next/link";
import { useAuth } from "/firebase/auth.js";
import { useRouter } from "next/navigation";

export default function LandingPage() {
    const { currentUser } = useAuth();
    const router = useRouter();

    //if (currentUser) {
        //router.push('/home');
    //}

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Full-Screen Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute w-full h-full object-cover"
            >
                <source src="/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>

            {/* Navbar */}
            <div className="absolute flex items-center justify-between w-full px-12 py-6">
                <h1 className="text-[34px] font-bold text-white">Clio.</h1>
                <Link href="/login">
                    <p className="hover:underline text-lg hover:text-orange font-semibold text-white transition">Login</p>
                </Link>
            </div>

            {/* Hero Content */}
            <div className="absolute bottom-10 left-10 max-w-[90%] sm:left-5 px-8 py-16 text-left">
                <h1 className="text-white text-5xl font-bold leading-tight">Next Gen Marketing Assistant</h1>
                <h4 className="text-gray-300 text-lg mt-3 max-w-lg">
                    Changing the way brands create and connect through AI-powered marketing.
                </h4>
                <Link href="/login">
                    <h4 className="mt-6 shadow-[4px_4px_0px_0px_#333] border-2 border-grey inline-block bg-orange text-gray-900 px-8 py-2 rounded-full font-semibold transition hover:shadow-lg hover:scale-105">
                        Create
                    </h4>
                </Link>
            </div>
        </div>
    );
}
