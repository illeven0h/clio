"use client";
import { useState, useRef, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { initializeFirebase } from "/firebase/initFirebase";

export default function SettingsPanel({ isOpen, onClose }) {
  const [email, setEmail] = useState(null); 
  const [username , setUsername] = useState(null);
  const panelRef = useRef(null);
  const { firestore, auth } = initializeFirebase(); 

  //getting username and email
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setEmail(user.email);
  
        try {
          // Fetch the username from Firestore
          const userDocSnap = await getDoc(doc(firestore, "users", user.uid));
  
          if (userDocSnap.exists()) {
            setUsername(userDocSnap.data().username); // Fetch username
          } else {
            setUsername("Unknown User");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUsername("Error fetching username");
        }
      } else {
        setEmail("null");
        setUsername("null");
      }
    });
  
    return () => unsubscribe();
  }, [auth]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        if (onClose) {
          onClose();
        }
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Don't render anything if not open
  if (!isOpen) return null;

  return (
    <>
      {/* Black overlay */}
      <div className="fixed inset-0 bg-background backdrop-filter backdrop-blur-sm bg-opacity-40 z-40"></div>

      {/* Settings Panel */}
      <div
        ref={panelRef}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/4 h-[400px] bg-background border-4 border-grey shadow-[6px_6px_0px_0px_#333333] rounded-[20px] flex z-50"
      >
        {/* Sidebar */}
        <div className="w-1/4 p-4 border-r text-black font-semibold">
          Settings
        </div>

        {/* Content Area */}
        <div className="w-2/3 p-4 text-black">
          <h2 className="text-lg font-semibold">General</h2>
          <div className="mt-4">
            <div >
            <p className="text-sm font-semibold">Username</p>
            <p className="text-sm">{username}</p>
            </div>
            <hr className="my-2" />
            <div>
            <p className="text-sm font-semibold">Email</p>
            <p className="text-sm">{email}</p>
            </div>
            <hr className="my-2" />
            <p className="text-sm font-semibold">Theme</p>
            <hr className="my-2" />
          </div>

          {/* Toggle Options */}
          <div className="mt-4">
            <p className="font-semibold">Publish To Explore</p>
            <p className="text-xs text-gray-600">
              Videos you create can be seen by others in explore feeds.
            </p>
            <label className="relative inline-block w-10 h-5 mt-2">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-purple-500 transition"></div>
              <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full peer-checked:left-6 transition"></div>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}