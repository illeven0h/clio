"use client";

import Button from './Button';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from "../../../firebase/auth";
const Nav = () => {
    const {logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () =>{
        try {
            await logout(); // Sign out from Firebase
            console.log('User logged out');
            router.push('/'); // Redirect to the landing page
          } catch (error) {
            console.error('Error logging out: ', error);
          }

    }

    const pathname = usePathname();

    // Define routes where the navbar should not appear
    const noNavRoutes = ["/","/login","/signup", "/admin/dashboard", "/admin/dashboard/feedback", "/admin/dashboard/users", "/admin/dashboard/content", "/admin/dashboard/reports", "/admin/dashboard/setting", "/admin/dashboard/profile"];

    // Check if the current route matches any in the list
    if (noNavRoutes.includes(pathname)) return null;

    const isHome = pathname?.includes("/home");
    const isDashboard = pathname?.includes("/dashboard");
    const isCreate = pathname?.includes("/create");
    const isFeedback = pathname?.includes("/feedback");
    const isProfile = pathname?.includes("/profile");

    return (
        <nav className='w-full text-white z-50 mt-4 fixed'>
            {/* Absolute container for logo and logout button */}
            <div className="flex justify-between items-center px-4 2xl:px-16">
                <Link href="/home">
                    <h4 className="text-3xl cursor-pointer text-white">Clio</h4>
                </Link>
                <div className='flex justify-center px-3 py-1 md:px-3 lg:px-4'>
                    <ul className='flex'>
                        <Link href="/home">
                            <li className={`font-secondary ml-10 hover:border-b text-sm ${isHome ? "text-bone" : ""}`}>Home</li>
                        </Link>
                        <Link href="/create">
                            <li className={`font-secondary ml-10 hover:border-b text-sm ${isCreate ? "text-bone" : ""}`}>Create</li>
                        </Link>
                        <Link href="/dashboard">
                            <li className={`font-secondary ml-10 hover:border-b text-sm ${isDashboard ? "text-bone" : ""}`}>Dashboard</li>
                        </Link>
                        <Link href="/feedback">
                            <li className={`font-secondary ml-10 hover:border-b text-sm ${isFeedback ? "text-bone" : ""}`}>Feedback</li>
                        </Link>
                        <Link href="/profile">
                            <li className={`font-secondary ml-10 hover:border-b text-sm ${isProfile ? "text-bone" : ""}`}>Profile</li>
                        </Link>
                    </ul>
                </div>
                <Button onClick= {handleLogout} text="logout" />
            </div>
        </nav>
    );
};

export default Nav;
