import Link from 'next/link';
import React from 'react';
const Nav = () => {
    return (
        <nav className='mt-4 fixed w-full text-bone z-50'>
            <div className='flex justify-center px-3 py-1 md:px-5 lg:px-16'>
                {/* Menu always visible */}
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
        </nav>
    );
};

export default Nav;
