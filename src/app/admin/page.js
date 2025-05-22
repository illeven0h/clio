"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getApp } from "firebase/app";

export default function AdminVideoList() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const app = getApp();
      const firestore = getFirestore(app);
      const querySnapshot = await getDocs(collection(firestore, "videos"));
      const videoList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videoList);
      setError(null);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError("Failed to load videos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-700">Loading videos...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="px-6 min-h-screen">
      {videos.length === 0 ? (
        <div className="bg-background rounded-lg shadow-md p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <p className="text-xl text-grey">No videos found in the database.</p>
          <p className="text-grey mt-2">Videos uploaded by users will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <div key={video.id} className="bg-background rounded-lg shadow-md overflow-hidden flex flex-col h-full transform transition-transform hover:scale-[1.02] hover:shadow-lg">
              {video.src && (
                <div className="relative pb-[56.25%] w-full overflow-hidden">
                  <video 
                    src={video.src} 
                    controls 
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    poster={video.cloudinaryId ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/v1/${video.cloudinaryId}.jpg` : undefined}
                    preload="metadata"
                  />
                </div>
              )}
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-semibold text-grey mb-2 line-clamp-2">{video.title || "Untitled Video"}</h3>
                {video.description && <p className="text-grey mb-2 line-clamp-2 text-sm">{video.description}</p>}
                <div className="mt-auto">
                  <p className="text-sm text-gray-500 truncate">By: {video.uploadedBy || "Unknown"}</p>
                  {video.uploadedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(video.uploadedAt.seconds * 1000).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 w-full truncate mt-1">Title: {video.title || "Untitled Video"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}