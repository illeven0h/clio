"use client";
import { useState, useRef, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { initializeFirebase } from "/firebase/initFirebase";
import { getAuth } from "firebase/auth";
export default function Feedback() {
   const [email, setUserEmail] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [hoverRating, setHoverRating] = useState(null);
    const panelRef = useRef(null);
    const { firestore } = initializeFirebase();
    const auth = getAuth();
  
    // Rating labels
    const ratingLabels = {
      1: "Very Dissatisfied",
      2: "Dissatisfied",
      3: "Neutral",
      4: "Satisfied",
      5: "Very Satisfied"
    };
  
    // Getting the current user email
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserEmail(user.email);
        } else {
          setUserEmail(null);
        }
      });
  
      return () => unsubscribe();
    }, [auth]);
  
    // // Reset selection when panel closes
    // useEffect(() => {
    //   if (!isOpen) {
    //     setSelectedRating(null);
    //     setMessage("");
    //     setError("");
    //   }
    // }, [isOpen]);
  
    // // Close when clicking outside
    // useEffect(() => {
    //   function handleClickOutside(event) {
    //     if (panelRef.current && !panelRef.current.contains(event.target)) {
    //       if (onClose) {
    //         onClose();
    //       }
    //     }
    //   }
  
    //   if (isOpen) {
    //     document.addEventListener("mousedown", handleClickOutside);
    //   } else {
    //     document.removeEventListener("mousedown", handleClickOutside);
    //   }
  
    //   return () => {
    //     document.removeEventListener("mousedown", handleClickOutside);
    //   };
    // }, [isOpen, onClose]);
  
    const handleRatingClick = (rating) => {
      setSelectedRating(rating);
      console.log(`Selected rating: ${rating} - ${ratingLabels[rating]}`);
    };
  
    const handleRatingHover = (rating) => {
      setHoverRating(rating);
    };
  
    const handleRatingLeave = () => {
      setHoverRating(null);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      
      if (!selectedRating || !message) {
        setError("Please select a rating and provide feedback");
        setLoading(false);
        return;
      }
  
      if (!email) {
        setError("You must be logged in to submit feedback");
        setLoading(false);
        return;
      }
  
      try {
        // Create a unique ID using timestamp + email to avoid overwriting previous feedback
        const uniqueId = `${Date.now()}_${email.replace(/[.@]/g, '_')}`;
        
        // Store feedback in 'feedback' collection
        
        await setDoc(doc(firestore, "feedback", email),  { 
          rating: selectedRating, 
          message, 
          email,
          timestamp: new Date() 
        });
  
        alert("Feedback submitted successfully!");
        setSelectedRating(null);
        setMessage("");
        
        // if (onClose) {
        //   onClose();
        // }
      } catch (error) {
        console.error("Error submitting feedback:", error);
        setError("Failed to submit feedback. Please try again.");
      }
  
      setLoading(false);
    };
  
    // Don't render anything if not open
    // if (!isOpen) return null;
  
    return (
      <>
        {/* Black overlay */}
        {/* <div className="fixed inset-0 bg-background backdrop-filter backdrop-blur-sm bg-opacity-40 z-40"></div> */}
  
        {/* Feedback Panel */}
        <div
          ref={panelRef}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/4 bg-background border-4 border-black shadow-[6px_6px_0px_0px_black] rounded-[40px] p-6 z-50"
        >
          <h2 className="text-xl font-bold text-grey">User Feedback</h2>
          
          <p className="text-grey mb-4">How Was Your Experience With Clio</p>
          
          {/* Rating Emojis */}
          <div className="flex justify-between mb-6 max-w-md mx-auto">
            {/* Rating 1 - Very Dissatisfied */}
            <div className="flex flex-col items-center relative">
              <button 
                onClick={() => handleRatingClick(1)}
                className={`p-2 rounded-full transition-colors ${selectedRating === 1 ? 'bg-orange-200' : ''}`}
              >
                <div className={`w-12 h-12 text-[#F26B3A] border-2 border-[#F26B3A] rounded-full flex items-center justify-center 
                      ${selectedRating === 1 ? 'bg-orange' : 'hover:bg-orange'}`}
                >
                  <span className="text-2xl">😠</span>
                </div>
              </button>
              
              {/* Hover Tooltip */}
              <div
                className={`absolute bottom-full mb-2 z-10 p-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-700 w-40 text-center transition-opacity duration-200 
                    ${hoverRating === 1 || selectedRating === 1 ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onMouseEnter={() => handleRatingHover(1)}
                onMouseLeave={handleRatingLeave}
              >
                <div className="font-semibold">{ratingLabels[1]}</div>
                <div className="absolute w-3 h-3 bg-white border-b border-r border-gray-200 transform rotate-45 left-1/2 -ml-1.5 -bottom-1.5"></div>
              </div>
            </div>
            
            {/* Rating 2 - Dissatisfied */}
            <div className="flex flex-col items-center relative">
              <button 
                onClick={() => handleRatingClick(2)}
                className={`p-2 rounded-full transition-colors ${selectedRating === 2 ? 'bg-orange-200' : ''}`}
              >
                <div className={`w-12 h-12 text-[#F26B3A] border-2 border-[#F26B3A] rounded-full flex items-center justify-center 
                      ${selectedRating === 2 ? 'bg-orange ' : 'hover:bg-orange '}`}
                >
                  <span className="text-2xl">😐</span>
                </div>
              </button>
              
              {/* Hover Tooltip */}
              <div
                className={`absolute bottom-full mb-2 z-10 p-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-700 w-40 text-center transition-opacity duration-200 
                    ${hoverRating === 2 || selectedRating === 2 ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onMouseEnter={() => handleRatingHover(2)}
                onMouseLeave={handleRatingLeave}
              >
                <div className="font-semibold">{ratingLabels[2]}</div>
                <div className="absolute w-3 h-3 bg-white border-b border-r border-gray-200 transform rotate-45 left-1/2 -ml-1.5 -bottom-1.5"></div>
              </div>
            </div>
            
            {/* Rating 3 - Neutral */}
            <div className="flex flex-col items-center relative">
              <button 
                onClick={() => handleRatingClick(3)}
                className={`p-2 rounded-full transition-colors ${selectedRating === 3 ? 'bg-orange-200' : ''}`}
              >
                <div className={`w-12 h-12 text-[#F26B3A] border-2 border-[#F26B3A] rounded-full flex items-center justify-center 
                      ${selectedRating === 3 ? 'bg-orange ' : 'hover:bg-orange '}`}
                >
                  <span className="text-2xl">🙂</span>
                </div>
              </button>
              
              {/* Hover Tooltip */}
              <div
                className={`absolute bottom-full mb-2 z-10 p-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-700 w-40 text-center transition-opacity duration-200 
                    ${hoverRating === 3 || selectedRating === 3 ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onMouseEnter={() => handleRatingHover(3)}
                onMouseLeave={handleRatingLeave}
              >
                <div className="font-semibold">{ratingLabels[3]}</div>
                <div className="absolute w-3 h-3 bg-white border-b border-r border-gray-200 transform rotate-45 left-1/2 -ml-1.5 -bottom-1.5"></div>
              </div>
            </div>
            
            {/* Rating 4 - Satisfied */}
            <div className="flex flex-col items-center relative">
              <button 
                onClick={() => handleRatingClick(4)}
                className={`p-2 rounded-full transition-colors ${selectedRating === 4 ? 'bg-orange-200' : ''}`}
              >
                <div className={`w-12 h-12 text-[#F26B3A] border-2 border-[#F26B3A] rounded-full flex items-center justify-center 
                      ${selectedRating === 4 ? 'bg-orange ' : 'hover:bg-orange '}`}
                >
                  <span className="text-2xl">😄</span>
                </div>
              </button>
              
              {/* Hover Tooltip */}
              <div
                className={`absolute bottom-full mb-2 z-10 p-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-700 w-40 text-center transition-opacity duration-200 
                    ${hoverRating === 4 || selectedRating === 4 ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onMouseEnter={() => handleRatingHover(4)}
                onMouseLeave={handleRatingLeave}
              >
                <div className="font-semibold">{ratingLabels[4]}</div>
                <div className="absolute w-3 h-3 bg-white border-b border-r border-gray-200 transform rotate-45 left-1/2 -ml-1.5 -bottom-1.5"></div>
              </div>
            </div>
            
            {/* Rating 5 - Very Satisfied */}
            <div className="flex flex-col items-center relative">
              <button 
                onClick={() => handleRatingClick(5)}
                className={`p-2 rounded-full transition-colors `}
              >
                <div className={`w-12 h-12 text-[#F26B3A] border-2 border-[#F26B3A] rounded-full flex items-center justify-center 
                      ${selectedRating === 5 ? 'bg-orange ' : 'hover:bg-orange '}`}
                >
                  <span className="text-2xl">😍</span>
                </div>
              </button>
              
              {/* Hover Tooltip */}
              <div
                className={`absolute bottom-full mb-2 z-10 p-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-700 w-40 text-center transition-opacity duration-200 
                    ${hoverRating === 5 || selectedRating === 5 ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onMouseEnter={() => handleRatingHover(5)}
                onMouseLeave={handleRatingLeave}
              >
                <div className="font-semibold">{ratingLabels[5]}</div>
                <div className="absolute w-3 h-3 bg-white border-b border-r border-gray-200 transform rotate-45 left-1/2 -ml-1.5 -bottom-1.5"></div>
              </div>
            </div>
          </div>
          
          <p className="text-grey mb-4">If You would Like, Please Share Your Thoughts. Clio Will Work Hard To Improve!</p>
          
          {/* Textarea */}
          <div className="mb-6">
            <textarea 
              name="message"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-32 p-4 border-2 bg-transparent border-grey rounded-lg focus:outline-none focus:none text-black"
              placeholder="We Welcome Your Thoughts"
            ></textarea>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-4 text-red-500 text-sm">{error}</div>
          )}
          
          {/* Buttons */}
          <div className="flex justify-end gap-4">
            {/* <button 
              onClick={onClose}
              className="px-4 py-2  text-black border-2 border-black rounded-full shadow-[3px_3px_0px_0px_rgba(13,13,15,1.00)] hover:bg-neon font-semibold"
              disabled={loading}
            >
              Close
            </button> */}
            <button 
              onClick={handleSubmit}
              className="px-4 py-2 bg-neon text-black border-2 border-black rounded-full shadow-[3px_3px_0px_0px_black] font-semibold"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Confirm"}
            </button>
          </div>
        </div>
      </>
    );
}