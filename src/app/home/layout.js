"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../components/SideBar";
import FloatingInput from "../components/FloatingInput";
import DropDownAvatar from "../components/DropDownAvatar";
import SettingsPanel from "../components/SettingsPanel";
import FeedbackPanel from "../components/FeedbackPanel"; // Import the FeedbackPanel

const getPageTitle = (pathname) => {
  const pageTitles = {
    "/home": "Featured",
    "/home/spotlight": "Spotlight",
    "/home/explore/recent": "Recent",
    "/home/explore/liked": "Liked",
    "/home/library/all": "All Videos",
    "/home/library/uploads": "Uploads",
    "/home/library/archives": "Archives",
    "/home/analytics/dashboard": "Analytics Dashboard",
  };
  return pageTitles[pathname] || "Clio";
};

const HomeLayout = ({ children }) => {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
  
  // Add state for managing panel visibility
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar (Fixed Width) */}
      <Sidebar />
      
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
        {/* {pathname !== "/home/chat" && <FloatingInput />} */}
        
        {/* Settings Panel */}
        <SettingsPanel 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
        
        {/* Feedback Panel */}
        <FeedbackPanel 
          isOpen={isFeedbackOpen} 
          onClose={() => setIsFeedbackOpen(false)} 
        />
      </div>
    </div>
  );
};

export default HomeLayout;