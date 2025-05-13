"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getApp } from "firebase/app";

export default function RecommendationScroller() {
  const [randomVideos, setRandomVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomVideos = async () => {
      try {
        setLoading(true);
        const app = getApp();
        const firestore = getFirestore(app);
        const querySnapshot = await getDocs(collection(firestore, "videos"));
        const allVideos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const shuffled = allVideos.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 7);

        setRandomVideos(selected);
        setError(null);
      } catch (err) {
        console.error("Error fetching the videos:", err);
        setError("Failed to load the videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchRandomVideos();
  }, []);

  if (loading) return <p className="text-gray-500">Loading random videos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 snap-x snap-mandatory">
          {randomVideos.map((video) => (
            <div
              key={video.id}
              className="snap-start bg-white rounded-lg shadow-md flex-shrink-0 w-64 h-40 overflow-hidden"
            >
              {video.src && (
                <video
                  src={video.src}
                  className="w-full h-48 object-cover"
                  reload="metadata"
                  muted
                  controls
                  autoPlay
                  loop
                  playsInline
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
