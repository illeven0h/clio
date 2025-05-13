"use client";
import { useState } from "react";
import { FaArrowUpLong } from "react-icons/fa6";

export default function FloatingInput() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  const generateVideo = async () => {
    const trimmedPrompt = prompt.trim();

    // Basic checks for prompt quality
    if (
      trimmedPrompt.length < 10 ||                         // too short
      /^[a-zA-Z]*$/.test(trimmedPrompt) ||                // one word only
      /^[a-z]{1,5}$/.test(trimmedPrompt.toLowerCase()) || // likely junk
      /(asdf|qwer|test|lorem|hello|1234)/i.test(trimmedPrompt) // common junk
    ) {
      setError("Invalid prompt. Please enter a more detailed and descriptive prompt.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setDebugInfo(null);
    
    try {
      console.log("Sending request to generate video...");
      const response = await fetch("/api/generatedVideos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      console.log("Response received:", data);
      
      if (!response.ok) {
        // Show detailed debug info if available
        if (data.htmlPreview || data.details) {
          setDebugInfo({
            preview: data.htmlPreview || data.details,
            status: response.status
          });
        }
        throw new Error(data.error || data.details || 'Failed to generate video');
      }
      
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
      } else if (data.videoData) {
        // If we get base64 data instead of a URL
        setVideoUrl(`data:video/mp4;base64,${data.videoData}`);
      } else {
        throw new Error('No video data received');
      }
    } catch (error) {
      console.error("Error generating video:", error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      generateVideo();
    }
  };

  return (
    <div className="fixed z-10 bottom-10 left-1/2 transform -translate-x-1/2 w-full sm:w-[500px] md:w-[600px] lg:w-[700px] xl:w-[750px] bg-background shadow-[6px_6px_0px_0px_#333333] rounded-[40px] p-3 border-4 border-grey cursor-pointer flex items-center gap-3r">
      <div className="flex items-center gap-3 w-full">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 text-black bg-background rounded-full outline-none placeholder-gray-400"
          placeholder="Describe your ad..."
          disabled={loading}
        />
        <button
          onClick={generateVideo}
          disabled={loading}
          className={`flex items-center justify-center w-12 h-10 ${loading ? 'bg-gray-300' : 'bg-[#CBFF9C]'} text-black rounded-full shadow-[3px_3px_0px_0px_rgba(13,13,15,1.00)] border-2 border-black transition-all duration-200 ease-in-out transform hover:scale-105 hover:rotate-1`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-black rounded-full animate-spin" />
          ) : (
            <FaArrowUpLong className="w-5 h-5" />
          )}
        </button>
      </div>

      {loading && <p className="mt-2 text-sm text-gray-500">Generating video... This may take a minute or two.</p>}
      
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
          
          {debugInfo && (
            <div className="mt-2">
              <details className="text-xs">
                <summary className="cursor-pointer text-gray-700">Show technical details</summary>
                <div className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                  <pre className="whitespace-pre-wrap break-words">{debugInfo.preview}</pre>
                </div>
              </details>
            </div>
          )}
        </div>
      )}
      
      {videoUrl && (
        <div className="mt-4">
          <video controls className="w-full rounded-lg bg-black">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}