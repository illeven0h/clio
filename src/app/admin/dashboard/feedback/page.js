// "use client";
// import { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore"; 
// import { initializeFirebase } from "/firebase/initFirebase";

// export default function AdminFeedback() {
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Initialize Firebase and Firestore
//   const { firestore } = initializeFirebase();

//   useEffect(() => {
//     const fetchFeedbacks = async () => {
//       try {
//         // Fetch all documents from the "feedback" collection
//         const feedbackCollection = collection(firestore, "feedback");
//         const querySnapshot = await getDocs(feedbackCollection);

//         // Map over the snapshot to create an array of feedback objects
//         const feedbackList = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         setFeedbacks(feedbackList);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching feedback: ", error);
//       }
//     };

//     fetchFeedbacks();
//   }, [firestore]);

//   if (loading) {
//     return <div>Loading feedback...</div>;
//   }

//   return (
//     <div className="feedback-container">
//       <h5 className=" mt-8 mb-4 text-center text-[30px]">User Feedback</h5>
//       {feedbacks.length === 0 ? (
//         <p>No feedback available.</p>
//       ) : (
//         <div className="flex gap-4 flex-wrap justify-center">
//           {feedbacks.map((feedback) => (
//             <div
//               key={feedback.id}
//               className="border-2 w-80 h-auto rounded-xl border-bone p-6 shadow-lg feedback-item"
//             >
//               <h5 className="font-bold text-lg text-Bone mb-2">
//                 {feedback.name}
//               </h5>
//               <p className="text-sm text-ivory mb-4">
//                 <span className="font-semibold">Email:</span> {feedback.email}
//               </p>
//               <p className="text-sm text-ivory mb-4">
//                 <span className="font-semibold">Status:</span> {feedback.status}
//               </p>
//               <p className="text-sm text-ivory">
//                 <span className="font-semibold">Feedback:</span> {feedback.message}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
