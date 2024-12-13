import React from 'react'
import Link from 'next/link'
const AdminNav = () => {
  return (
    <nav className='mt-4 fixed w-full text-bone z-50'>
    <div className='flex justify-center px-3 py-1 md:px-5 lg:px-16'>
        {/* Menu always visible */}
        <ul className='flex'>
            <Link href="/admin/home">
                <li className='font-secondary ml-10 hover:border-b text-sm'>Dashboard</li>
            </Link>
            <Link href="/admin/users">
                <li className='font-secondary ml-10 hover:border-b text-sm'>Users</li>
            </Link>
            <Link href="/admin/content">
                <li className='font-secondary ml-10 hover:border-b text-sm'>Content</li>
            </Link>
            <Link href="/admin/reports">
                <li className='font-secondary ml-10 hover:border-b text-sm'>Reports</li>
            </Link>
            <Link href="/admin/settigs">
                <li className='font-secondary ml-10 hover:border-b text-sm'>Setting</li>
            </Link>
            <Link href="/admin/profile">
                <li className='font-secondary ml-10 hover:border-b text-sm'>Logs</li>
            </Link>
        </ul>
    </div>
    </nav>
  )
}

export default AdminNav