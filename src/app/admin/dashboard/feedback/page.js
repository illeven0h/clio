"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore"; // Correct import for fetching collection
import { initializeFirebase } from "/firebase/initFirebase"; // Import your Firebase initialization

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize Firebase and Firestore
  const { firestore } = initializeFirebase();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        // Fetch all documents from the "feedback" collection
        const feedbackCollection = collection(firestore, "feedback");
        const querySnapshot = await getDocs(feedbackCollection);
        
        // Map over the snapshot to create an array of feedback objects
        const feedbackList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setFeedbacks(feedbackList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching feedback: ", error);
      }
    };

    fetchFeedbacks();
  }, [firestore]);

  if (loading) {
    return <div>Loading feedback...</div>;
  }

  return (
    <div className="feedback-container">
      <h5 className="text-bone mb-4 text-center text-[30px]">User Feedback</h5>
      {feedbacks.length === 0 ? (
        <p>No feedback available.</p>
      ) : (
        <div className="flex gap-4 flex-wrap">
          {feedbacks.map(feedback => (
            <div key={feedback.id} className="border-2 w-80 h-auto rounded-xl border-bone rounded-sm p-4 feedback-item">
              <h5 className="bg-bone text-black text-centre">{feedback.name}</h5>
              <p >Email:{feedback.email}</p>
              <p>status: {feedback.status}</p>
              <p>feedback: {feedback.message}</p>
              {/* <p className="text-[12px]">time stamp: {feedback.timestamp? feedback.timestamp.toLocaleString() : "No timestamp available"}</p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
