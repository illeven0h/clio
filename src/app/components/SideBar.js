"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  MdOutlineExplore, MdOutlineStar, MdOutlineVideoLibrary, 
  MdOutlineArchive, MdOutlineFavorite, MdOutlineDashboard 
} from "react-icons/md";

const Sidebar = () => {
  // Menu items array
  const menuItems = [
    {
      title: "Explore",
      subItems: [
        { title: "Featured", path: "/home", icon: <MdOutlineStar /> },
        { title: "Spotlight", path: "/home/spotlight", icon: <MdOutlineExplore /> },
      ],
    },
    {
      title: "Library",
      subItems: [
        { title: "All Videos", path: "/home/library/AllVideos", icon: <MdOutlineVideoLibrary /> },
        { title: "Archives", path: "/home/library/archives", icon: <MdOutlineArchive /> },
        { title: "Liked", path: "/explore/liked", icon: <MdOutlineFavorite /> },
      ],
    },
    {
      title: "Analytics",
      subItems: [
        { title: "Dashboard", path: "/analytics/dashboard", icon: <MdOutlineDashboard /> },
      ],
    },
  ];

  return (
    <div className="h-screen w-56 fixed text-orange p-6">
      {/* Sidebar Header */}
      <Image src="/logo.png" alt="logo" width={60} height={60} />
      {/* <h1 className="text-[24px] text-black">Clio.</h1> */}
      {/* Menu Items */}
      <ul className="mt-6 space-y-6">
        {menuItems.map((section, index) => (
          <li key={index}>
            <h5 className="text-base font-bold text-grey text-opacity-40 mb-2">{section.title}</h5>
            <ul className="">
              {section.subItems.map((item, subIndex) => (
                <li key={subIndex}>
                  <Link
                    className="flex items-center space-x-3 py-1 px-3 rounded-md hover:text-white hover:bg-orange hover:bg-opacity-80 transition-col"
                    href={item.path}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-grey font-semibold">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
