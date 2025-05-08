"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../firebase/auth";
import { useRouter } from "next/navigation";
import VideoGrid from "../components/VideosGrid";

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();

  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser === undefined) return;
    if (!currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (!currentUser) return;

    async function fetchVideos() {
      try {
        setLoading(true);
        const res = await fetch("/api/videos");
        if (!res.ok) throw new Error("Failed to fetch videos");

        const data = await res.json();

        const formattedVideos = data.videos.map((video) => ({
          src: video.url,
          title: video.display_name || video.filename,
          description: `Video ID: ${video.asset_id.substring(0, 8)}...`,
        }));

        setVideos(formattedVideos);
      } catch (error) {
        setError("Could not load videos. Check API.");
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [currentUser]);

  if (currentUser === undefined) {
    return (
      <div className="flex justify-center items-center h-screen text-orange text-lg">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {loading && (
        <p className="text-center text-orange py-8">Loading videos...</p>
      )}

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
