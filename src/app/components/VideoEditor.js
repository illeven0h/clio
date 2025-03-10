import { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa"; // Import FaTimes for back button

export default function VideoEditor({ videos, onBack, singleVideoMode = false }) {
  const [selectedVideo, setSelectedVideo] = useState(singleVideoMode ? videos[0] : null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(null);
  const [overlayText, setOverlayText] = useState("");
  const [filter, setFilter] = useState("none");
  const [speed, setSpeed] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [outputVideo, setOutputVideo] = useState(null);
  const [error, setError] = useState(null);
  
  // Refs for handling video and canvas operations
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const outputVideoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Set end time when a video is selected
  useEffect(() => {
    if (selectedVideo && videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        setEndTime(videoRef.current.duration);
      };
    }
  }, [selectedVideo]);

  // Clean up function for when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      // Clean up any object URLs to prevent memory leaks
      if (outputVideo) {
        URL.revokeObjectURL(outputVideo);
      }
    };
  }, [outputVideo]);

  // Handle when outputVideo changes
  useEffect(() => {
    if (outputVideo && outputVideoRef.current) {
      // Force reload the video element
      outputVideoRef.current.load();
    }
  }, [outputVideo]);

  // Auto-select the first video if in singleVideoMode
  useEffect(() => {
    if (singleVideoMode && videos && videos.length > 0 && !selectedVideo) {
      setSelectedVideo(videos[0]);
    }
  }, [singleVideoMode, videos, selectedVideo]);

  const applyFilter = (context, filter) => {
    switch (filter) {
      case "grayscale":
        context.filter = "grayscale(100%)";
        break;
      case "sepia":
        context.filter = "sepia(100%)";
        break;
      case "contrast":
        context.filter = "contrast(200%)";
        break;
      case "brightness":
        context.filter = "brightness(150%)";
        break;
      case "blur":
        context.filter = "blur(5px)";
        break;
      default:
        context.filter = "none";
    }
  };

  const processVideo = async () => {
    if (!selectedVideo || !videoRef.current) return;
    setError(null);
    setProcessing(true);
    console.log("Starting video processing");
    
    try {
      // Setup canvas for drawing video frames
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!canvas) {
        console.error("Canvas ref is not available");
        setError("Canvas is not available");
        setProcessing(false);
        return;
      }
      
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 360;
      console.log("Canvas dimensions:", canvas.width, canvas.height);
      
      // Stop any previous streams
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      // Reset chunks array
      chunksRef.current = [];
      
      // Get the canvas stream
      try {
        streamRef.current = canvas.captureStream(30); // Explicitly set 30fps
        console.log("Stream created successfully");
      } catch (err) {
        console.error("Error creating stream:", err);
        setError("Failed to create stream: " + err.message);
        setProcessing(false);
        return;
      }
      
      // Try different MIME types based on browser support
      let mimeType = '';
      const supportedTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4'
      ];
      
      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          console.log("Using MIME type:", mimeType);
          break;
        }
      }
      
      if (!mimeType) {
        setError("No supported video format found in your browser");
        setProcessing(false);
        return;
      }
      
      // Create media recorder from stream
      try {
        const mediaRecorder = new MediaRecorder(streamRef.current, {
          mimeType: mimeType,
          videoBitsPerSecond: 2500000
        });
        mediaRecorderRef.current = mediaRecorder;
        console.log("MediaRecorder created with type:", mimeType);
      } catch (err) {
        console.error("Error creating MediaRecorder:", err);
        setError("Failed to create recorder: " + err.message);
        setProcessing(false);
        return;
      }
      
      // Handle data available event
      mediaRecorderRef.current.ondataavailable = (e) => {
        console.log("Data available, size:", e.data.size);
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      // Handle recording stopped event
      mediaRecorderRef.current.onstop = () => {
        console.log("Recording stopped. Chunks:", chunksRef.current.length);
        
        if (chunksRef.current.length === 0) {
          setError("No video data was recorded");
          setProcessing(false);
          return;
        }
        
        // Create blob with the appropriate type
        const blob = new Blob(chunksRef.current, { type: mimeType.split(';')[0] });
        console.log("Created blob of size:", blob.size);
        
        if (blob.size === 0) {
          setError("Created video has zero size");
          setProcessing(false);
          return;
        }
        
        // If we have an existing URL, revoke it to avoid memory leaks
        if (outputVideo) {
          URL.revokeObjectURL(outputVideo);
        }
        
        const url = URL.createObjectURL(blob);
        console.log("Created object URL:", url);
        setOutputVideo(url);
        setProcessing(false);
      };
      
      // Start recording
      mediaRecorderRef.current.start(100);
      console.log("Recording started");
      
      // Set video to start time
      video.currentTime = parseFloat(startTime);
      
      // Handle rendering frames
      const endTimeValue = parseFloat(endTime) || video.duration;
      let lastDrawTime = 0;
      const timeScale = 1 / parseFloat(speed);
      
      // Make the canvas temporarily visible for debugging
      const originalDisplay = canvas.style.display;
      canvas.style.display = 'block';
      canvas.style.position = 'absolute';
      canvas.style.left = '-9999px';
      
      // Play the video
      video.play();
      
      // Function to draw frame with text overlay and filter
      const drawFrame = (timestamp) => {
        if (!video.paused && !video.ended) {
          if (timestamp - lastDrawTime > 15) { // Aim for about 60fps
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Apply filter
            applyFilter(ctx, filter);
            
            // Draw video frame
            try {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            } catch (err) {
              console.error("Error drawing video to canvas:", err);
            }
            
            // Reset filter for text overlay
            ctx.filter = "none";
            
            // Add text overlay if specified
            if (overlayText) {
              ctx.font = '30px Arial';
              ctx.fillStyle = 'white';
              ctx.strokeStyle = 'black';
              ctx.lineWidth = 2;
              ctx.strokeText(overlayText, 20, 50);
              ctx.fillText(overlayText, 20, 50);
            }
            
            lastDrawTime = timestamp;
          }
          
          // Stop when we reach the end time
          if (video.currentTime >= endTimeValue) {
            video.pause();
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
              mediaRecorderRef.current.stop();
            }
            canvas.style.display = originalDisplay;
            return;
          }
          
          requestAnimationFrame(drawFrame);
        }
      };
      
      // Start the animation loop
      video.onplay = () => requestAnimationFrame(drawFrame);
      
    } catch (error) {
      console.error("Error processing video:", error);
      setError("Error: " + error.message);
      setProcessing(false);
    }
  };

  // Function to handle going back to video selection or parent component
  const handleBack = () => {
    if (onBack && singleVideoMode) {
      // If we have a callback for returning to parent component
      onBack();
    } else {
      // Normal behavior - go back to video selection
      setSelectedVideo(null);
      setStartTime(0);
      setEndTime(null);
      setOverlayText("");
      setFilter("none");
      setSpeed(1);
      setError(null);
      
      // Clean up output video
      if (outputVideo) {
        URL.revokeObjectURL(outputVideo);
        setOutputVideo(null);
      }
      
      // Stop any active streams
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
  };

  return (
    <div className="p-8 bg-background rounded-[32px] shadow-[6px_6px_0px_0px_rgba(13,13,15,1.00)] border-4 border-grey">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Video Editor</h1>
        <button 
          className="bg-neon border-grey border-2 shadow-[3px_3px_0px_0px_rgba(13,13,15,1.00)] text-grey p-2 rounded-full flex items-center gap-2"
          onClick={handleBack}
        >
          <FaTimes />
        </button>
      </div>

      {!selectedVideo && !singleVideoMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {videos && videos.length > 0 ? (
            videos.map((video) => (
              <div key={video.public_id || video.src} className="cursor-pointer">
                <video
                  width="300"
                  controls
                  onClick={() => setSelectedVideo(video)}
                >
                  <source src={video.secure_url || video.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <p className="text-center mt-1">
                  {video.public_id 
                    ? video.public_id.split('/').pop() 
                    : video.title || "Untitled Video"}
                </p>
              </div>
            ))
          ) : (
            <p>No videos available.</p>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Editing: {selectedVideo.public_id || selectedVideo.title || "Video"}
            </h2>
          </div>
          
          {/* Error message if any */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
              {error}
            </div>
          )}
          
          {/* Original video (hidden if output video exists) */}
          <div className="flex items-center justify-center">
          {!outputVideo && (
            <video
              ref={videoRef}
              width="600"
              controls
              className=" rounded-xl  mt-4"
              src={selectedVideo.secure_url || selectedVideo.src}
              crossOrigin="anonymous"
            ></video>
          )}
          </div>
          {/* Canvas for video processing - now visible during development */}
          <canvas 
            ref={canvasRef} 
            style={{ display: 'none' }}
          ></canvas>


          {/* Trimming Inputs */}
          <div className="mx-20 mt-4 items-center justify-between grid grid-cols-2 ">
            <div >
              <label className="block mb-1">Start Time (seconds):</label>
              <input
                type="number"
                min="0"
                step="1"
                value={startTime}
                onChange={(e) => setStartTime(Math.max(0, parseFloat(e.target.value) || 0))}
                className="border-2  border-grey shadow-[3px_3px_0px_0px_rgba(13,13,15,1.00)] bg-transparent outline-none rounded-xl px-4 py-2 w-1/2"
              />
            </div>
            
            <div className="justify-self-end">
              <label className=" block mb-1">End Time (seconds):</label>
              <input
                type="number"
                min={parseFloat(startTime) + 0.1}
                step="0.1"
                value={endTime || ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value > startTime) {
                    setEndTime(value);
                  }
                }}
                className="border-2 border-grey shadow-[3px_3px_0px_0px_rgba(13,13,15,1.00)] bg-transparent outline-none rounded-xl px-4  py-2 "
              />
            </div>
          </div>
          {/* Speed Control  and filter options*/}
          <div className="flex justify-between items-center">
          <div className="mx-20 mt-4">
            <label className="block mb-1 ">
              Playback Speed:</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              className="border-2 border-grey bg-transparent outline-none rounded-xl px-2 shadow-[3px_3px_0px_0px_rgba(13,13,15,1.00)] py-2 "
            >
              <option className="bg-background hover:bg-orange hover:text-white" value="0.25">0.25x (Slow)</option>
              <option className="bg-background hover:bg-orange hover:text-white" value="0.5">0.5x (Slow)</option>
              <option className="bg-background hover:bg-orange hover:text-white" value="0.75">0.75x (Slow)</option>
              <option className="bg-background hover:bg-orange hover:text-white" value="1">1x (Normal)</option>
              <option className="bg-background hover:bg-orange hover:text-white" value="1.25">1.25x (Fast)</option>
              <option className="bg-background hover:bg-orange hover:text-white" value="1.5">1.5x (Fast)</option>
              <option className="bg-background hover:bg-orange hover:text-white" value="2">2x (Fast)</option>
            </select>
          </div>

          {/* Filters Dropdown */}
          <div className="mx-20 mt-4">
            <label className="block mb-1">Apply Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border-2 border-grey bg-transparent outline-none rounded-xl px-2 shadow-[3px_3px_0px_0px_rgba(13,13,15,1.00)] py-2"
            >
              <option className="bg-background hover:bg-orange hover:text-white" value="none">None</option>
              <option className="bg-background hover:bg-orange hover:text-white" value="grayscale">Grayscale</option>
              <option className="bg-background hover:bg-orange hover:text-white" value="sepia">Sepia</option>
              <option className="bg-background hover:bg-orange hover:text-white" value="contrast">High Contrast</option>
              <option className="bg-background hover:bg-orange hover:text-white" value="brightness">Brightness</option>
              <option className="bg-background hover:bg-orange hover:text-white" value="blur">Blur</option>
            </select>
          </div>
          </div>
          

          {/* Text Overlay Input */}
          <div className="mx-20 mt-4">
            <label className="block mb-1">Overlay Text:</label>
            <input
              type="text"
              value={overlayText}
              onChange={(e) => setOverlayText(e.target.value)}
              className="border-2 border-grey bg-transparent outline-none rounded-xl px-4 shadow-[3px_3px_0px_0px_rgba(13,13,15,1.00)] py-2 w-full"
              placeholder="Add text to overlay on video"
            />
          </div>

          {/* Process Button */}
          <button 
            className={`mx-20 mt-6 px-4 py-3 text-grey border-2 border-grey shadow-[3px_3px_0px_0px_rgba(13,13,15,1.00)] rounded-xl font-bold ${processing ? "bg-neon" : "bg-neon hover:bg-neon-dark"}`}
            onClick={processVideo}
            disabled={processing}
          >
            {processing ? "Processing... Please wait" : (outputVideo ? "Process Again" : "Apply Edits & Export")}
          </button>

          {/* Output Video */}
          {outputVideo && (
            <div className="mt-6 p-4 border rounded-xl ">
              <h4 className="font-semibold">Edited Video:</h4>
              <div className="flex items-center justify-center">
              <video 
                ref={outputVideoRef}
                width="600" 
                controls 
                className=" rounded-xl mt-2"
                key={outputVideo} // Force re-render when url changes
                autoPlay
              >
                <source src={outputVideo} type="video/webm" />
                <source src={outputVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              </div>
              <div className="mt-4 flex space-x-4">
                <a 
                  href={outputVideo} 
                  download="edited_video.webm" 
                  className="flex-1 bg-orange bg-opacity-85 border-2 border-grey shadow-[3px_3px_0px_0px_rgba(13,13,15,1.00)] text-grey px-4 py-2 rounded-xl text-center font-bold"
                >
                  Download Video
                </a>
                <button
                  onClick={() => {
                    if (outputVideo) {
                      URL.revokeObjectURL(outputVideo);
                      setOutputVideo(null);
                    }
                  }}
                  className="flex-1 border-2 border-grey shadow-[3px_3px_0px_0px_rgba(13,13,15,1.00)] hover:bg-neon text-grey px-4 py-2 rounded-xl text-center font-bold"
                >
                  Edit Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}