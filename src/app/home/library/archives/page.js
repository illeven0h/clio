"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdGeneratorUI() {
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedPrompt(prompt);
    setVideoUrl("");
    setError("");
    setDebugInfo(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 600000); // 10 minutes timeout

    try {
      const response = await fetch("/api/generatedVideos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await response.json();
      } catch (parseErr) {
        throw new Error("Invalid JSON response from server");
      }

      if (!response.ok) {
        if (data.htmlPreview || data.details) {
          setDebugInfo({
            preview: data.htmlPreview || data.details,
            status: response.status,
            stack: data.stack,
          });
        }
        throw new Error(data.error || data.details || `Server error: ${response.status}`);
      }

      if (data.videoData) {
        const dataUrl = `data:video/mp4;base64,${data.videoData}`;
        setVideoUrl(dataUrl);
      } else if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
      } else {
        throw new Error("No video data received from server");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Video generation timed out after 10 minutes.");
      } else {
        setError(err.message || "Unexpected error occurred.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateNew = () => {
    setPrompt("");
    setVideoUrl("");
    setGeneratedPrompt("");
    setError("");
    setDebugInfo(null);
  };

  const hasVideo = !!videoUrl;

  return (
    <div className="min-h-screen mt-24 bg-background text-grey p-4">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {(!hasVideo || isGenerating) && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-xl mx-auto"
              >
                <div className="backdrop-blur-sm bg-background p-4 border-4 border-grey rounded-[40px] shadow-[6px_6px_0px_0px_#333333]">
                  {isGenerating ? (
                    <div className="text-center">
                      <div className="animate-spin w-12 h-12 border-4 border-[#CBFF9C] border-t-transparent rounded-full mx-auto mb-4"></div>
                      <h2 className="text-xl font-semibold mb-2">Generating Your Ad...</h2>
                      <p className="text-gray-400">Creating: &quot;{generatedPrompt}&quot;</p>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-semibold mb-6 text-center">
                        {hasVideo ? "Create New Ad" : "Describe Your Ad"}
                      </h2>
                      <div className="space-y-4">
                        <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="e.g., A dynamic tech startup ad with modern graphics..."
                          className="w-full p-4 rounded-xl bg-background border border-gray-600 text-grey placeholder-gray-400 focus:border-[#CBFF9C] focus:outline-none focus:ring-2 focus:ring-orange min-h-[120px] resize-none"
                          rows={4}
                        />
                        <button
                          onClick={handleGenerate}
                          disabled={!prompt.trim() || isGenerating}
                          className="w-full bg-gradient-to-r from-[#CBFF9C] to-[#f4a261] hover:from-[#b2ff7f] hover:to-[#f4a261] disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-grey py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg"
                        >
                          {isGenerating ? "Generating..." : "Generate Video Ad"}
                        </button>
                        {error && (
                          <p className="text-red-500 text-sm text-center">{error}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {hasVideo && !isGenerating && (
              <motion.div
                key="output"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                <div className="bg-background backdrop-blur-sm p-8 border-4 border-grey rounded-[40px] shadow-[6px_6px_0px_0px_#333333]">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-semibold">Your Generated Ad</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCreateNew}
                          className="bg-[#CBFF9C] text-grey border-2 border-grey rounded-full shadow-[3px_3px_0px_0px_rgba(13,13,15,1.00)] px-4 py-2 "
                        >
                          Create New
                        </button>
                      </div>
                    </div>
                    {generatedPrompt && (
                      <p className="text-grey text-sm p-3 rounded-lg">
                        <span className="font-bold text-grey">Prompt:</span> &quot;{generatedPrompt}&quot;
                      </p>
                    )}
                  </div>

                  <div className="relative rounded-xl overflow-hidden bg-black">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full aspect-video object-cover"
                      poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%23000'/%3E%3Ctext x='400' y='225' text-anchor='middle' fill='%23666' font-family='Arial' font-size='24'%3EGenerated Ad Video%3C/text%3E%3C/svg%3E"
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 justify-center">
                    <a
                      href={videoUrl}
                      download={`generated-video-${Date.now()}.mp4`}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      ⬇️ Download
                    </a>


                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
