"use client";
import Image from "next/image";
import {
  FaShare, FaHeart, FaComments, FaTimes, FaPaperPlane
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore, collection, addDoc, getDocs, query, where,
  Timestamp, doc, updateDoc, increment, getDoc, setDoc
} from "firebase/firestore";
import { initializeFirebase } from "../../../firebase/initFirebase";
import VideoEditor from "./VideoEditor";

const { firestore } = initializeFirebase();
const auth = getAuth();

export default function VideoGrid({ videos: initialVideos }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    const initializeVideos = async () => {
      if (initialVideos?.length > 0) {
        // First, set up videos from Cloudinary with default interaction data
        const videosWithDefaults = initialVideos.map(video => ({
          ...video,
          id: video.public_id || video.title || `video_${Date.now()}`,
          src: video.secure_url || video.src,
          likes: 0,
          comments: 0,
          shares: 0,
          commentsList: [],
          liked: false
        }));
        
        setVideos(videosWithDefaults);
        setLoading(false);
        
        // Then sync to Firebase and fetch interaction data in background
        await syncVideosWithFirebase(initialVideos);
        await fetchInteractionData(videosWithDefaults);
      } else {
        setLoading(false);
      }
    };

    initializeVideos();
    
    return () => {
      isMounted.current = false;
    };
  }, [initialVideos]);

  const syncVideosWithFirebase = async (apiVideos) => {
    const user = auth.currentUser;
    const syncPromises = [];
    
    for (const video of apiVideos) {
      const videoId = video.public_id || video.title || `video_${Date.now()}`;
      const syncPromise = (async () => {
        try {
          const videoRef = doc(firestore, "videos", videoId);
          const videoDoc = await getDoc(videoRef);
          
          if (!videoDoc.exists()) {
            await setDoc(videoRef, {
              id: videoId,
              title: video.title || "Untitled Video",
              description: video.description || "",
              src: video.secure_url || video.src,
              cloudinaryId: video.public_id || null,
              uploadedBy: user?.uid || "anonymous",
              uploadedAt: Timestamp.now(),
              likes: 0,
              comments: 0,
              shares: 0
            });
          }
        } catch (err) {
          console.error(`Error syncing video ${videoId}:`, err);
        }
      })();
      syncPromises.push(syncPromise);
    }
    
    await Promise.all(syncPromises);
  };

  // NEW: Only fetch interaction data, don't replace video src/metadata
  const fetchInteractionData = async (currentVideos) => {
    if (!isMounted.current) return;
    
    const user = auth.currentUser;
    
    try {
      const updatedVideos = await Promise.all(
        currentVideos.map(async (video) => {
          const videoId = video.id;
          
          // Fetch comments and likes for this specific video
          const [commentsSnapshot, likesSnapshot] = await Promise.all([
            getDocs(query(
              collection(firestore, "comments"),
              where("videoId", "==", videoId)
            )),
            user ? getDocs(query(
              collection(firestore, "likes"),
              where("videoId", "==", videoId),
              where("userId", "==", user.uid)
            )) : Promise.resolve({ empty: true })
          ]);
          
          // Get video stats from Firebase
          const videoRef = doc(firestore, "videos", videoId);
          const videoDoc = await getDoc(videoRef);
          const firebaseVideoData = videoDoc.exists() ? videoDoc.data() : {};
          
          const commentsList = commentsSnapshot.docs.map(commentDoc => ({
            id: commentDoc.id,
            ...commentDoc.data(),
            user: commentDoc.data().userName || commentDoc.data().userId,
            timestamp: commentDoc.data().timestamp.toDate().toLocaleString()
          }));
          
          const liked = !likesSnapshot.empty;
          
          // Keep original video data (src, etc.) but update interaction data
          return {
            ...video, // Keep original Cloudinary data
            likes: firebaseVideoData.likes || 0,
            comments: firebaseVideoData.comments || 0,
            shares: firebaseVideoData.shares || 0,
            commentsList,
            liked,
            // Preserve additional Firebase metadata if needed
            uploadedAt: firebaseVideoData.uploadedAt || video.uploadedAt,
            uploadedBy: firebaseVideoData.uploadedBy || video.uploadedBy
          };
        })
      );
      
      if (isMounted.current) {
        setVideos(updatedVideos);
      }
    } catch (error) {
      console.error("Error fetching interaction data:", error);
    }
  };

  const openVideoModal = (video, index) => {
    setSelectedVideo(video);
    setSelectedVideoIndex(index);
    setShowComments(false);
    setShowEditor(false);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    setSelectedVideoIndex(null);
    setCommentText("");
    setShowShareOptions(false);
    setShowComments(false);
    setShowEditor(false);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!selectedVideo) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to like videos");
      return;
    }

    const videoId = selectedVideo.id;
    const videoRef = doc(firestore, "videos", videoId);
    const updatedVideos = [...videos];
    const videoIndex = selectedVideoIndex;

    try {
      if (selectedVideo.liked) {
        const likesQuery = query(
          collection(firestore, "likes"),
          where("videoId", "==", videoId),
          where("userId", "==", user.uid)
        );
        const likesSnapshot = await getDocs(likesQuery);
        
        if (!likesSnapshot.empty) {
          const likeDoc = likesSnapshot.docs[0];
          await updateDoc(doc(firestore, "likes", likeDoc.id), {
            active: false,
            updatedAt: Timestamp.now()
          });
        }
        
        await updateDoc(videoRef, {
          likes: increment(-1)
        });
        
        updatedVideos[videoIndex].likes -= 1;
        updatedVideos[videoIndex].liked = false;
      } else {
        const likesQuery = query(
          collection(firestore, "likes"),
          where("videoId", "==", videoId),
          where("userId", "==", user.uid)
        );
        const likesSnapshot = await getDocs(likesQuery);
        
        if (likesSnapshot.empty) {
          await addDoc(collection(firestore, "likes"), {
            userId: user.uid,
            userName: user.displayName || user.email || "Anonymous",
            videoId: videoId,
            likedAt: Timestamp.now(),
            active: true
          });
        } else {
          const likeDoc = likesSnapshot.docs[0];
          await updateDoc(doc(firestore, "likes", likeDoc.id), {
            active: true,
            updatedAt: Timestamp.now()
          });
        }
        
        await updateDoc(videoRef, {
          likes: increment(1)
        });
        
        updatedVideos[videoIndex].likes += 1;
        updatedVideos[videoIndex].liked = true;
      }
      
      setVideos(updatedVideos);
      setSelectedVideo({ ...updatedVideos[videoIndex] });
    } catch (err) {
      console.error("Error handling like:", err);
    }
  };

  const handleShare = async (e, platform = null) => {
    e.stopPropagation();
    
    if (!selectedVideo) {
      alert("No video selected");
      return;
    }
    
    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to share videos");
      return;
    }

    // Use production base URL (replace with your app's domain)
    const baseUrl = "https://your-app.com"; // Update with your production domain
    const videoUrl = `${baseUrl}/videos/${selectedVideo.id}`; // Construct public URL
    const videoTitle = selectedVideo.title || "Untitled Video";

    // Validate videoUrl
    if (!videoUrl || typeof videoUrl !== "string") {
      alert("Invalid video URL");
      return;
    }

    try {
      if (platform) {
        // Handle specific share action
        if (platform === "Copy Link") {
          try {
            await navigator.clipboard.writeText(videoUrl);
            // No alert to avoid mentioning localhost
          } catch (err) {
            // Fallback for non-HTTPS or unsupported environments
            const textarea = document.createElement("textarea");
            textarea.value = videoUrl;
            document.body.appendChild(textarea);
            textarea.select();
            try {
              document.execCommand("copy");
            } catch (copyErr) {
              alert("Failed to copy link. Please copy manually: " + videoUrl);
            }
            document.body.removeChild(textarea);
          }
        } else if (platform === "Twitter") {
          const tweetText = `Check out this video: ${videoTitle}`;
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(videoUrl)}`, "_blank");
        } else if (platform === "Facebook") {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`, "_blank");
        }

        // Increment share count only when a share action is performed
        const videoRef = doc(firestore, "videos", selectedVideo.id);
        await updateDoc(videoRef, {
          shares: increment(1)
        });

        const updatedVideos = [...videos];
        updatedVideos[selectedVideoIndex].shares = (updatedVideos[selectedVideoIndex].shares || 0) + 1;
        setVideos(updatedVideos);
        setSelectedVideo({ ...updatedVideos[selectedVideoIndex] });
      }

      // Toggle share options only if no platform is specified
      if (!platform) {
        setShowShareOptions(!showShareOptions);
      } else {
        setShowShareOptions(false);
      }
    } catch (err) {
      console.error("Error handling share:", err);
      alert("Failed to share video. Please try again.");
    }
  };

  const toggleComments = (e) => {
    e.stopPropagation();
    setShowComments(!showComments);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to comment");
      return;
    }

    if (!selectedVideo) return;
    const videoId = selectedVideo.id;
    
    try {
      const newCommentRef = await addDoc(collection(firestore, "comments"), {
        userId: user.uid,
        userName: user.displayName || user.email || "Anonymous",
        videoId: videoId,
        text: commentText,
        timestamp: Timestamp.now()
      });
      
      const videoRef = doc(firestore, "videos", videoId);
      await updateDoc(videoRef, {
        comments: increment(1)
      });
      
      const newComment = {
        id: newCommentRef.id,
        text: commentText,
        user: user.displayName || user.email || "Anonymous",
        timestamp: new Date().toLocaleString()
      };
      
      const updatedVideos = [...videos];
      if (!updatedVideos[selectedVideoIndex].commentsList) {
        updatedVideos[selectedVideoIndex].commentsList = [];
      }
      
      updatedVideos[selectedVideoIndex].commentsList.push(newComment);
      updatedVideos[selectedVideoIndex].comments = (updatedVideos[selectedVideoIndex].comments || 0) + 1;
      
      setVideos(updatedVideos);
      setSelectedVideo({ ...updatedVideos[selectedVideoIndex] });
      setCommentText("");
    } catch (err) {
      console.error("Error saving comment:", err);
    }
  };

  const handleEditVideo = (e) => {
    e.stopPropagation();
    setShowEditor(true);
    setShowComments(false);
  };

  const handleBackFromEditor = () => {
    setShowEditor(false);
  };

  // Updated function to refresh interaction data after video updates
  const handleVideoUpdated = async () => {
    await fetchInteractionData(videos);
  };

  if (loading && videos.length === 0) {
    return <div className="container mx-auto p-2 text-center">Loading videos...</div>;
  }

  return (
    <div className="container mx-auto p-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {videos.map((video, index) => (
          <div
            key={video.id || index} 
            className="bg-background border border-black overflow-hidden shadow-lg relative group cursor-pointer"
            onClick={() => openVideoModal(video, index)}
          >
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              loading="lazy" 
              preload="metadata" 
              className="w-full h-48 object-cover"
              poster={video.poster || ""}
            >
              <source src={video.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
              <h4 className="text-sm font-semibold mb-2">{video.title || "Untitled"}</h4>
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

      {selectedVideo && !showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
          <div className="absolute inset-0 bg-background backdrop-filter backdrop-blur-sm bg-opacity-50" onClick={closeVideoModal}></div>

          <div className="relative z-10 w-full max-w-6xl max-h-screen overflow-auto">
            <div className="flex p-2 flex-col items-center">
              <div className="flex gap-4 text-grey">
                <h4 className="text-sm font-semibold">Username .</h4>
                <h4 className="text-sm font-semibold">{selectedVideo.title}</h4>
              </div>
              <div className="flex gap-4 text-grey">
                <h4 className="text-sm font-normal">720p</h4>
                <h4 className="text-sm font-normal">{new Date(selectedVideo.uploadedAt?.seconds * 1000).toLocaleDateString() || "Date & time"}</h4>
              </div>
            </div>

            <button
              className="absolute m-4 -top-0 p-1 right-0 text-grey shadow-[3px_3px_0px_0px_rgba(13,13,15,1.00)] bg-neon border-2 border-grey rounded-full"
              onClick={closeVideoModal}
            >
              <FaTimes />
            </button>

            <div className="m-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-black shadow-[6px_6px_0px_0px_black] rounded-2xl border-black border-4 overflow-hidden flex flex-col">
                  <div className="relative w-full pt-0">
                    <video controls autoPlay preload="auto" className="w-full h-auto max-h-[70vh] object-contain">
                      <source src={selectedVideo.src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  <div className="p-2 bg-background rounded-sm text-grey">
                    <div className="flex flex-col gap-1 items-center">
                      <h3 className="text-sm gap-4 font-normal">{selectedVideo.description || "Video"}</h3>
                      <div className="px-8 py-2 flex justify-between w-full">
                        <div className="flex text-center items-center gap-4">
                          <button className={`flex gap-1 items-center ${selectedVideo.liked ? 'text-red-500' : ''}`} onClick={handleLike}>
                            <FaHeart />
                            <span>{selectedVideo.likes || 0}</span>
                          </button>
                          <div className="relative">
                            <button className="flex gap-1 items-center" onClick={handleShare}>
                              <FaShare />
                              <span>{selectedVideo.shares || 0}</span>
                            </button>
                            {showShareOptions && (
                              <div className="absolute bottom-8 -left-12 bg-white p-2 shadow-lg rounded border border-gray-300">
                                <div className="flex flex-col gap-2 text-gray-800">
                                  <button onClick={(e) => handleShare(e, "Copy Link")} className="hover:bg-gray-100 p-1 rounded flex items-center gap-1">Copy Link</button>
                                  <button onClick={(e) => handleShare(e, "Twitter")} className="hover:bg-gray-100 p-1 rounded flex items-center gap-1">Twitter</button>
                                  <button onClick={(e) => handleShare(e, "Facebook")} className="hover:bg-gray-100 p-1 rounded flex items-center gap-1">Facebook</button>
                                </div>
                              </div>
                            )}
                          </div>

                          <button className={`flex gap-1 items-center ${showComments ? 'text-orange' : ''}`} onClick={toggleComments}>
                            <FaComments />
                            <span>{selectedVideo.comments || 0}</span>
                          </button>
                        </div>

                        <button className="bg-neon font-semibold shadow-[3px_3px_0px_0px_black] px-3 py-2 rounded-xl border-2 border-grey" onClick={handleEditVideo}>
                          edit video
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {showComments && (
                  <div className="md:w-80 h-auto md:max-h-[70vh] bg-background shadow-[6px_6px_0px_0px_black] rounded-2xl border-black border-4 overflow-hidden flex flex-col transition-all duration-300">
                    <div className="p-3 flex flex-col h-full">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-grey font-semibold text-lg flex items-center">
                          <FaComments className="mr-2" />
                          Comments ({selectedVideo.comments || 0})
                        </h3>
                        <button className="text-grey hover:text-gray-500 p-1" onClick={toggleComments}>
                          <FaTimes />
                        </button>
                      </div>

                      <div className="flex-grow overflow-y-auto mb-3">
                        {selectedVideo.commentsList?.length > 0 ? (
                          selectedVideo.commentsList.map((comment, i) => (
                            <div key={i} className="border-b border-gray-300 py-2">
                              <div className="flex justify-between text-grey">
                                <strong className="text-sm">{comment.user}</strong>
                                <span className="text-xs opacity-70">{comment.timestamp}</span>
                              </div>
                              <p className="text-sm mt-1">{comment.text}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-grey py-2">No comments yet</p>
                        )}
                      </div>

                      <form onSubmit={handleComment} className="flex gap-2 mt-auto">
                        <input
                          id="comment-input"
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 text-sm p-2 border border-gray-300 rounded-full text-grey bg-background"
                        />
                        <button type="submit" className="bg-neon text-grey p-3 rounded-full" disabled={!commentText.trim()}>
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

      {selectedVideo && showEditor && (
        <div className="fixed inset-0 z-50 bg-background backdrop-filter backdrop-blur-lg bg-opacity-50 flex items-start justify-center p-2 overflow-auto">
          <div className="w-full max-w-4xl">
            <VideoEditor
              videos={[{ public_id: selectedVideo.cloudinaryId || selectedVideo.id, secure_url: selectedVideo.src }]}
              onBack={handleBackFromEditor}
              singleVideoMode={true}
              onVideoUpdated={handleVideoUpdated}
            />
          </div>
        </div>
      )}
    </div>
  );
}