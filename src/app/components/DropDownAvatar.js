"use client";
import { useState, useEffect, useRef } from "react";
import { FiSettings, FiMessageCircle, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../../firebase/auth";
import { useRouter } from 'next/navigation';

export default function DropDownAvatar({ onSettingsClick, onFeedbackClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicks outside of the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSettingsClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    if (onSettingsClick) {
      onSettingsClick();
    }
  };

  const handleFeedbackClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    if (onFeedbackClick) {
      onFeedbackClick();
    }
  };

  //logout function
  const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout(); // Sign out from Firebase
            console.log('User logged out');
            router.push('/'); // Redirect to the landing page
        } catch (error) {
            console.error('Error logging out: ', error);
        }
    };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Backdrop overlay for dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full border-2 border-grey bg-[#CBFF9C] shadow-[3px_3px_0px_0px_#333333] flex items-center justify-center relative z-20"
      >
        👤
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 z-20 bg-background border-2 border-black shadow-[4px_4px_0px_0px_#333333] divide-y divide-grey divide-opacity-20 rounded-lg w-48">
          <ul className="py-2 text-sm text-black">
            <li>
              <a 
                href="#" 
                className="flex items-center gap-2 px-4 py-2 hover:bg-orange dark:hover:text-white"
                onClick={handleSettingsClick}
              >
                <FiSettings size={16} /> Settings
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="flex items-center gap-2 px-4 py-2 hover:bg-orange dark:hover:text-white"
                onClick={handleFeedbackClick}
              >
                <FiMessageCircle size={16} /> User Feedback
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 px-4 py-2 hover:bg-orange dark:hover:text-white">
                <FiHelpCircle size={16} /> Help
              </a>
            </li>
          </ul>
          <div className="py-2">
            <a href="#" onClick={handleLogout}  className="flex items-center gap-2 px-4 py-2 text-sm text-black hover:bg-orange dark:hover:text-white">
              
              <FiLogOut size={16} /> Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  );
}