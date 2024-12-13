'use client';

import React, { useState } from "react";
import Nav from "../components/Nav";
import Card from "../components/Card";

const ContentGrid = ({ hasContent }) => {
  if (!hasContent) {
    return (
      <div className="text-center text-gray-600">
        <p>Nothing to show...yet! Ads you create will live here.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
        </div>
  );
};

const Frame = ({ onTabClick }) => {
  const [activeTab, setActiveTab] = useState("creation");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabClick(tab); // Assuming you want to pass the selected tab to the parent component
  };

  return (
    <>
    <div className="relative w-full flex flex-row items-center justify-center text-center text-lg text-black font-body pb-2 space-x-5">
      <a
        href="#"
        className={`relative text-[16px] lowercase font-secondary text-bone hover:text-gray-500 ${activeTab === "creation" ? "border-b-2 border-white" : ""}`}
        onClick={() => handleTabClick("creation")}
      >
        Creation
      </a>
      <a
        href="#"
        className={`relative lowercase text-[16px] font-secondary text-bone hover:text-gray-500 ${activeTab === "saved" ? "border-b-2 border-white" : ""}`}
        onClick={() => handleTabClick("saved")}
      >
        Saved
      </a>
      <a
        href="#"
        className={`relative lowercase text-[16px] font-secondary text-bone hover:text-gray-500 ${activeTab === "spotlight" ? "border-b-2 border-white" : ""}`}
        onClick={() => handleTabClick("spotlight")}
      >
        Spotlight
      </a>
      <a
        href="#"
        className={`relative lowercase text-[16px] font-secondary text-bone hover:text-gray-500 ${activeTab === "liked" ? "border-b-2 border-white" : ""}`}
        onClick={() => handleTabClick("liked")}
      >
        Liked
      </a>
    </div>
    </>
  );
};


export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("creation");

  // Simulate presence of content for each category
  const hasCreatedVideos = activeTab === "creation" && true; // Simulate true content for Creation tab
  const hasSavedVideos = activeTab === "saved" && false; // Simulate no content for Saved tab
  const hasSpotlightVideos = activeTab === "spotlight" && true; // Simulate true content for Spotlight tab
  const hasLikedVideos = activeTab === "liked" && false; // Simulate no content for Liked tab

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
    <Nav />
    <div className="bg-[#1B1B1B] pt-16 min-h-screen bg-floralwhite flex flex-col items-center">
      {/* Profile Picture */}
      <div className="py-6">
        <div className="w-[120px] h-[120px] relative rounded-full overflow-hidden border-4 border-ivory">
          <img
            src="/profile.svg"
            alt="Profile Picture"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Username */}
      <div className="w-full font-secondary text-center text-[20px]  text-ivory inline-block capitalize mb-2">
        sana Lio
      </div>

      {/* Action Buttons */}
      {/* <div className="flex mt-4 justify-center gap-4">
        <button className="px-6 py-1 bg-black text-white rounded-md text-sm lowercase font-michroma">
          Create Ad
        </button>
      </div> */}

      {/* Tab Navigation */}
      <div className="mt-6 w-full">
        <Frame onTabClick={handleTabClick} />
      </div>

      {/* Content Grid Component */}
      <div className="mt-6">
        {activeTab === "creation" && <ContentGrid hasContent={hasCreatedVideos} />}
        {activeTab === "saved" && <ContentGrid hasContent={hasSavedVideos} />}
        {activeTab === "spotlight" && <ContentGrid hasContent={hasSpotlightVideos} />}
        {activeTab === "liked" && <ContentGrid hasContent={hasLikedVideos} />}
      </div>
    </div>
    </>
  );
}
