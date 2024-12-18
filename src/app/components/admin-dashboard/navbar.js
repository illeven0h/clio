"use client";
import React from 'react'
import { MdSearch } from 'react-icons/md';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const path = usePathname();
  return (
    <nav className='p-4  rounded-xl shadow-md ' >
    <div className='flex justify-between items-center'>
        <div className='text-bone font-secondary '>{path.split("/admin/").pop()}</div>
        <div className='border-bone p-2 gap-4 rounded-xl w-max border-2 w-content flex justify-evenly'>
          <MdSearch className=' h-[24px] w-[24px]' />
          <input type="text" placeholder='search' className=' rounded-[20px] bg-transparent  w-64 text-[12px] font-body'/>
        </div>
    </div>
    </nav>
  )
}

export default Navbar