"use client";
import React from "react";
import VideoGrid from "../components/VideosGrid";
import { useAuth } from "../../../firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Home() {
  const {currentUser} = useAuth()
  const router = useRouter()

   if(!currentUser) {
    router.push('/')
  }
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        const res = await fetch("/api/videos");
        if (!res.ok) throw new Error("Failed to fetch videos");

        const data = await res.json();
        console.log("Fetched Videos:", data); // Debugging log
        
        // Transform the API response to match the expected video format
        const formattedVideos = data.videos.map(video => {
          return {
            src: video.url, // Adjust cloud name as needed
            title: video.display_name || video.filename,
            description: `Video ID: ${video.asset_id.substring(0, 8)}...` // Using part of the asset_id as description
          };
        });
        
        setVideos(formattedVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError("Could not load videos. Check API.");
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  return (
    <div className="container mx-auto px-4">
      
      {loading && <p className="text-center text-orange py-8">Loading videos...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {!loading && !error && videos.length === 0 && (
        <p className="text-center py-8">No videos found.</p>
      )}
      
      {videos.length > 0 && <VideoGrid videos={videos} />}
    </div>
  );
}