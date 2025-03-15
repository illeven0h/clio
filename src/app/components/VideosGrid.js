import Image from "next/image";
import { FaShare, FaHeart, FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";
import { useState } from "react";
import { CldVideoPlayer } from 'next-cloudinary';
import VideoEditor from "./VideoEditor"; // Import the VideoEditor component

export default function VideoGrid({ videos: initialVideos }) {
  const [videos, setVideos] = useState(initialVideos.map(video => ({
    ...video,
    likes: video.likes || 0,
    comments: video.comments || 0,
    share: video.share || 0,
    commentsList: video.commentsList || [],
    liked: false
  })));
  
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showEditor, setShowEditor] = useState(false); // New state for showing the editor

  const openVideoModal = (video, index) => {
    setSelectedVideo(video);
    setSelectedVideoIndex(index);
    setShowComments(false); // Reset comments panel when opening a new video
    setShowEditor(false); // Reset editor when opening a new video
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    setSelectedVideoIndex(null);
    setCommentText("");
    setShowShareOptions(false);
    setShowComments(false);
    setShowEditor(false); // Reset editor state
  };

  const handleLike = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (!selectedVideo) return;
    
    const updatedVideos = [...videos];
    const video = updatedVideos[selectedVideoIndex];
    
    // Toggle like status
    if (video.liked) {
      video.likes -= 1;
      video.liked = false;
    } else {
      video.likes += 1;
      video.liked = true;
    }
    
    setVideos(updatedVideos);
    setSelectedVideo({...video});
  };

  const handleShare = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowShareOptions(!showShareOptions);
    
    if (!showShareOptions) {
      // Only increment share count when opening share options
      const updatedVideos = [...videos];
      updatedVideos[selectedVideoIndex].share += 1;
      setVideos(updatedVideos);
      setSelectedVideo({...updatedVideos[selectedVideoIndex]});
    }
  };

  const toggleComments = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowComments(!showComments);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const updatedVideos = [...videos];
    const video = updatedVideos[selectedVideoIndex];
    
    // Add new comment and increment count
    video.commentsList = [
      ...video.commentsList,
      { text: commentText, user: "You", timestamp: new Date().toLocaleString() }
    ];
    video.comments += 1;
    
    setVideos(updatedVideos);
    setSelectedVideo({...video});
    setCommentText("");
  };

  // Function to handle the "edit video" button click
  const handleEditVideo = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowEditor(true); // Show the editor
    setShowComments(false); // Hide comments when opening editor
  };

  // Function to handle returning from editor to video view
  const handleBackFromEditor = () => {
    setShowEditor(false);
  };

  return (
    <div className="container mx-auto p-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {videos.map((video, index) => (
          <div 
            key={index} 
            className="bg-background border border-black overflow-hidden shadow-lg relative group cursor-pointer"
            onClick={() => openVideoModal(video, index)}
          >
            <video 
              autoPlay
              loop
              muted
              className="w-full h-48 object-cover"
            >
              <source src={video.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Overlay that appears on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
              <div className="flex gap-1 items-center mb-2">
                <FaHeart />
                <span>{video.likes || 0}</span>
              </div>
              <div className="flex gap-1 items-center">
                <FaComments />
                <span>{video.comments || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && !showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
          {/* Black overlay */}
          <div 
            className="absolute inset-0 bg-background backdrop-filter backdrop-blur-sm bg-opacity-50"
            onClick={closeVideoModal}
          ></div>
          
          {/* Modal content */}
          <div className="relative z-10 w-full max-w-6xl max-h-screen overflow-auto">
            <div className="flex p-2 flex-col items-center">
              <div className="flex gap-4 text-grey">
                <h4 className="text-sm font-semibold">Username .</h4>
                <h4 className="text-sm font-semibold">{selectedVideo.title}</h4>
              </div>
              <div className="flex gap-4 text-grey">
                <h4 className="text-sm font-normal">720p</h4>
                <h4 className="text-sm font-normal">Date & time</h4>
              </div>
            </div>
            
            {/* Close button */}
            <button 
              className="absolute m-4 -top-0 p-1 right-0 text-grey shadow-[3px_3px_0px_0px_rgba(13,13,15,1.00)] bg-neon border-2 border-grey rounded-full"
              onClick={closeVideoModal}
            >
              <FaTimes />
            </button>
            
            {/* Video player and comments side by side */}
            <div className="m-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Video player */}
              <div className="flex-1 bg-black shadow-[6px_6px_0px_0px_black] rounded-2xl border-black border-4 overflow-hidden flex flex-col">
                <div className="relative w-full pt-0">
                  <video 
                    controls
                    autoPlay
                    className="w-full h-auto max-h-[70vh] object-contain"
                  >
                    <source src={selectedVideo.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                {/* Video info */}
                <div className="p-2 bg-background rounded-sm text-grey">
                  <div className="flex flex-col gap-1 items-center">
                    <h3 className="text-sm gap-4 font-normal">{selectedVideo.description || "Video"}</h3>
                    <div className="px-8 py-2 flex justify-between w-full">
                    <div className="flex text-center items-center gap-4">
                      <button 
                        className={`flex gap-1 items-center ${selectedVideo.liked ? 'text-red-500' : ''}`}
                        onClick={handleLike}
                      >
                        <FaHeart />
                        <span>{selectedVideo.likes || 0}</span>
                      </button>
                      <div className="relative">
                        <button 
                          className="flex gap-1 items-center"
                          onClick={handleShare}
                        >
                          <FaShare />
                          <span>{selectedVideo.share || 0}</span>
                        </button>
                        {showShareOptions && (
                          <div className="absolute bottom-8 -left-12 bg-white p-2 shadow-lg rounded border border-gray-300">
                            <div className="flex flex-col gap-2 text-gray-800">
                              <button className="hover:bg-gray-100 p-1 rounded flex items-center gap-1">
                                <span>Copy Link</span>
                              </button>
                              <button className="hover:bg-gray-100 p-1 rounded flex items-center gap-1">
                                <span>Twitter</span>
                              </button>
                              <button className="hover:bg-gray-100 p-1 rounded flex items-center gap-1">
                                <span>Facebook</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                  
                      <button 
                        className={`flex gap-1 items-center ${showComments ? 'text-orange' : ''}`}
                        onClick={toggleComments}
                      >
                        <FaComments />
                        <span>{selectedVideo.comments || 0}</span>
                      </button>
                    </div>

                    {/* edit button */}
                    <button 
                      className="bg-neon font-semibold shadow-[3px_3px_0px_0px_black] px-3 py-2 rounded-xl border-2  border-grey"
                      onClick={handleEditVideo}
                    >
                      edit video
                    </button>

                    </div>
                  </div>
                </div>
              </div>
              
              {/* Comments section (side panel that appears only when toggled) */}
              {showComments && (
                <div className="md:w-80 h-auto md:max-h-[70vh] bg-background shadow-[6px_6px_0px_0px_black] rounded-2xl border-black border-4 overflow-hidden flex flex-col transition-all duration-300">
                  <div className="p-3 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-grey font-semibold text-lg flex items-center">
                        <FaComments className="mr-2" />
                        Comments ({selectedVideo.comments})
                      </h3>
                      <button
                        className="text-grey hover:text-gray-500 p-1"
                        onClick={toggleComments}
                      >
                        <FaTimes />
                      </button>
                    </div>
                    
                    {/* Comment list */}
                    <div className="flex-grow overflow-y-auto mb-3">
                      {selectedVideo.commentsList && selectedVideo.commentsList.length > 0 ? (
                        selectedVideo.commentsList.map((comment, i) => (
                          <div key={i} className="border-b border-gray-300 py-2">
                            <div className="flex justify-between text-grey">
                              <strong className="text-sm">{comment.user}</strong>
                              <span className="text-xs text-grey opacity-70">{comment.timestamp}</span>
                            </div>
                            <p className="text-sm mt-1 text-grey">{comment.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-grey py-2">No comments yet</p>
                      )}
                    </div>
                    
                    {/* Comment form */}
                    <form onSubmit={handleComment} className="flex gap-2 mt-auto">
                      <input
                        id="comment-input"
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 text-sm p-2 border border-gray-300 rounded-full text-grey bg-background"
                      />
                      <button 
                        type="submit"
                        className="bg-neon text-grey p-3 rounded-full"
                        disabled={!commentText.trim()}
                      >
                        <FaPaperPlane />
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Editor Modal - Show when editor is activated */}
      {selectedVideo && showEditor && (
        <div className="fixed inset-0 z-50 bg-background backdrop-filter backdrop-blur-lg bg-opacity-50 flex items-start justify-center p-2 bg- overflow-auto">
          <div className="w-full max-w-4xl ">
            <VideoEditor 
              videos={[{ 
                public_id: selectedVideo.title || "video", 
                secure_url: selectedVideo.src 
              }]} 
              onBack={handleBackFromEditor}
              singleVideoMode={true}  // Custom prop to indicate we're editing a single video
            />
          </div>
        </div>
      )}
    </div>
  );
}