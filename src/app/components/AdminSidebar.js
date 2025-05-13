"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

import {
  MdOutlineStar,
  MdFeedback,
  MdComment,
  MdOutlineDashboard,
} from "react-icons/md";

const menuItems = [
  { title: "Videos", path: "/admin", icon: <MdOutlineStar /> },
  { title: "Feedback", path: "/admin/feedback", icon: <MdFeedback /> },
  { title: "Comments", path: "/admin/comments", icon: <MdComment /> },
  { title: "Dashboard", path: "/admin/dashboard", icon: <MdOutlineDashboard /> },
];

const AdminSidebar = () => {
  return (
    <div className="h-screen w-56 fixed bg-background shadow-md p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <Image src="/logo.png" alt="logo" width={60} height={60} />
        {/* <h1 className="text-xl font-bold text-grey">Admin</h1> */}
      </div>

      {/* Menu */}
      <ul className="space-y-4">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.path}
              className="flex items-center space-x-3 py-1 px-3 rounded-md hover:text-white hover:bg-orange hover:bg-opacity-80 transition-col"
            >
              <span className="text-xl text-orange hover:text-white">{item.icon}</span>
              <span className="text-sm text-grey hover:text-white font-medium">{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
