"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdDashboard, MdPeople, MdContentPaste, MdReport, MdSettings, MdPerson } from 'react-icons/md';

const Sidebar = () => {
  const router = useRouter();

  console.log("router", router.pathname)
  // Menu items array
  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <MdDashboard />,
    },
    {
      title: "User Management",
      path: "/admin/dashboard/users",
      icon: <MdPeople />,
    },
    {
      title: "Content Management",
      path: "/admin/dashboard/content",
      icon: <MdContentPaste />,
    },
    {
      title: "Reports",
      path: "/admin/dashboard/reports",
      icon: <MdReport />,
    },
    {
      title: "Settings",
      path: "/admin/dashboard/setting",
      icon: <MdSettings />,
    },
    {
      title: "Profile",
      path: "/admin/dashboard/profile",
      icon: <MdPerson />,
    },
  ];

  return (
    <div className="h-screen fixed bg-gray-800 text-white p-8">
      {/* Sidebar Header */} 
      <h4 className="text-xl mb-6">Admin Dashboard</h4>

      {/* Menu Items */}
      <ul className="mt-8 space-y-2">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link 
            className={'flex items-center space-x-3 py-2 px-3 rounded-md hover:bg-gray-700 transition-col ' }
            href={item.path}>
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
