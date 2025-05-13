"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";
import DropDownAvatar from "../components/DropDownAvatar";
import SettingsPanel from "../components/SettingsPanel";
import FeedbackPanel from "../components/FeedbackPanel"; // Import the FeedbackPanel

const getPageTitle = (pathname) => {
  const pageTitles = {
    "/admin": "Videos Management",
    "/admin/feedback": "User Feedbacks",
    "/admin/comments": "User Comments",
    "/admin/dashboard": "Admin Dashboard",
  };
  return pageTitles[pathname] || "Admin";
};

const AdminLayout = ({ children }) => {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
  
  // Add state for managing panel visibility
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar (Fixed Width) */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 pt-4 ml-56">  {/* <-- Added `ml-64` to push content right */}
        {/* Header */}
        <div className="flex justify-between px-6 py-2 text-center text-orange items-center mb-6">
          <h3 className="text-[20px]">{pageTitle}</h3>
          <DropDownAvatar 
            onSettingsClick={() => setIsSettingsOpen(true)} 
            onFeedbackClick={() => setIsFeedbackOpen(true)} 
          />
        </div>

        {/* Dynamic Page Content */}
        {children}

        <SettingsPanel 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />

        
      </div>
    </div>
  );
};

export default AdminLayout;