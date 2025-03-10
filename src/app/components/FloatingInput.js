"use client";
import { useState, useRef, useEffect } from "react";
import { FaArrowUpLong } from "react-icons/fa6";

export default function FloatingInput() {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust height dynamically
    }
  }, [input]);

  return (
    <div className="fixed flex justify-between items-center gap-4 bottom-10 left-1/2 transform -translate-x-1/2 w-full sm:w-[500px] md:w-[600px] lg:w-[700px] xl:w-[750px] bg-background shadow-[6px_6px_0px_0px_#333333] rounded-[40px] p-4 border-4 border-grey">
      {/* Text Input (Single-Line Behavior) */}
      <textarea
        ref={textareaRef}
        className="flex-grow h-[40px] max-h-[200px] text-grey text-opacity-80 bg-background p-3 rounded-[25px] resize-none focus:outline-none focus:ring-0 focus:border-transparent "
        placeholder="Describe your add..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={1} // Ensures only one row
      />

      {/* Send Button */}
      <button className="flex items-center justify-center w-12 h-10 bg-[#CBFF9C] text-black rounded-full shadow-[3px_3px_0px_0px_rgba(13,13,15,1.00)] border-2 border-black transition-all duration-200 ease-in-out transform hover:scale-105 hover:rotate-1">
        <FaArrowUpLong className="w-5 h-5" />
      </button>
    </div>
  );
}
