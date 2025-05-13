"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore, deleteDoc, doc } from "firebase/firestore";
import { getApp } from "firebase/app";
import { getStorage, ref, deleteObject } from "firebase/storage";

export default function AdminVideoList() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState({});
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  const handleDeleteVideo = async (videoId, cloudinaryId) => {
    setSelectedVideo({ id: videoId, cloudinaryId });
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedVideo) return;
    
    const { id, cloudinaryId } = selectedVideo;
    setDeleting(prev => ({ ...prev, [id]: true }));
    
    try {
      const app = getApp();
      const firestore = getFirestore(app);
      const storage = getStorage(app);
      
      // Delete the document from Firestore
      await deleteDoc(doc(firestore, "videos", id));
      
      // If using Firebase Storage, delete the file
      if (cloudinaryId) {
        try {
          // This is a placeholder for Cloudinary deletion
          // In a real implementation, you would use Cloudinary's API or a server function
          console.log(`Would delete Cloudinary video with ID: ${cloudinaryId}`);
        } catch (storageError) {
          console.error("Error deleting video file:", storageError);
        }
      }
      
      // Update the UI by removing the deleted video
      setVideos(videos.filter(video => video.id !== id));
      setShowConfirmModal(false);
      setSelectedVideo(null);
      
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video. Please try again.");
    } finally {
      setDeleting(prev => ({ ...prev, [id]: false }));
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setSelectedVideo(null);
  };

  if (loading) return <p className="p-6 text-gray-700">Loading videos...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="px-6 min-h-screen">
      {/* <div className="flex justify-between items-center mb-6"> */}
        {/* <button 
          onClick={fetchVideos}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button> */}
      {/* </div> */}

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
                
                {/* <div className="flex flex-wrap items-center gap-3 text-gray-500 mb-2 text-sm">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h.01M12 11c1.665-1.665 4.335-1.665 6 0l-3 3L12 11z" />
                    </svg>
                    <span>{video.likes !== null && video.likes !== undefined ? video.likes : "0"}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.5 9 12c0-.5-.114-.938-.316-1.342m0 2.684a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{video.comments !== null && video.comments !== undefined ? video.comments : "0"}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h6a3 3 0 003-3v-1m3-12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{video.shares !== null && video.shares !== undefined ? video.shares : "0"}</span>
                  </div>
                </div> */}
                
                <div className="mt-auto">
                  <p className="text-sm text-gray-500 truncate">By: {video.uploadedBy || "Unknown"}</p>
                  {video.uploadedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(video.uploadedAt.seconds * 1000).toLocaleDateString()}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-y-1 mt-2">
                    {video.cloudinaryId && (
                      <p className="text-xs text-gray-400 w-full truncate">ID: {video.cloudinaryId}</p>
                    )}
                    <p className="text-xs text-gray-400 w-full truncate">Video ID: {video.id}</p>
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleDeleteVideo(video.id, video.cloudinaryId)}
                      disabled={deleting[video.id]}
                      className={`px-3 py-1.5 rounded-md text-white text-sm font-medium ${
                        deleting[video.id] 
                          ? "bg-red-300 cursor-not-allowed" 
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {deleting[video.id] ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this video? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 rounded-md text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}