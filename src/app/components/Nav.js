"use client";
import Button from './Button';
import Link from 'next/link';
import React from 'react';

const Nav = () => {
    
    return (
        <nav className=' w-full text-bone z-50 mt-4 fixed'>
            {/* Absolute container for logo and logout button */}
            <div className="flex justify-between items-center px-4 2xl:px-16">
                <Link href="/home">
                    <h4 className="text-3xl cursor-pointer text-white">Clio</h4>
                </Link>
                <div className='flex justify-center px-3 py-1 md:px-3 lg:px-'>
                <ul className='flex'>
                    <Link href="/home">
                        <li className='font-secondary ml-10 hover:border-b text-sm'>Home</li>
                    </Link>
                    <Link href="/create">
                        <li className='font-secondary ml-10 hover:border-b text-sm'>Create</li>
                    </Link>
                    <Link href="/dashboard">
                        <li className='font-secondary ml-10 hover:border-b text-sm'>Dashboard</li>
                    </Link>
                    <Link href="/feedback">
                        <li className='font-secondary ml-10 hover:border-b text-sm'>Feedback</li>
                    </Link>
                    <Link href="/profile">
                        <li className='font-secondary ml-10 hover:border-b text-sm'>Profile</li>
                    </Link>
                </ul>
            </div>
                <Button
                 text="logout" />
            </div>
        </nav>
    );
};

export default Nav;
