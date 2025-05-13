"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore, updateDoc, doc } from "firebase/firestore";
import { getApp } from "firebase/app";

export default function FeedbackTable() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const app = getApp();
        const firestore = getFirestore(app);
        const querySnapshot = await getDocs(collection(firestore, "feedback"));
        const feedbackData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp ? new Date(doc.data().timestamp.seconds * 1000).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }) : 'N/A',
        }));
        setFeedbackList(feedbackData);
        setError(null);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setError("Failed to load feedback. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const handleStatusChange = (feedbackId, newStatus) => {
    setStatusUpdates(prev => ({ ...prev, [feedbackId]: newStatus }));
    setFeedbackList(prevList =>
      prevList.map(feedback =>
        feedback.id === feedbackId ? { ...feedback, status: newStatus } : feedback
      )
    );
  };

  const saveStatusUpdate = async (feedbackId) => {
    const app = getApp();
    const firestore = getFirestore(app);
    const feedbackRef = doc(firestore, "feedback", feedbackId);
    const newStatus = statusUpdates[feedbackId];

    try {
      await updateDoc(feedbackRef, { status: newStatus });
      setStatusUpdates(prev => {
        const newState = { ...prev };
        delete newState[feedbackId];
        return newState;
      });
      console.log(`Feedback ${feedbackId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating feedback status:", error);
      setError("Failed to update feedback status. Please try again.");
      fetchFeedback();
    }
  };

  if (loading) return <p className="p-6 text-gray-700">Loading feedback...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* <h2 className="text-3xl font-semibold mb-6 text-gray-900">User Feedback</h2> */}

      {feedbackList.length === 0 ? (
        <p className="text-black">No feedback received yet.</p>
      ) : (
        <div className="text-grey overflow-x-auto">
          <table className="min-w-full bg-background shadow-md rounded-lg">
            <thead className="bg-orange bg-opacity-75">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-grey uppercase tracking-wider sm:table-cell hidden">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-grey uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-grey uppercase tracking-wider lg:table-cell hidden">Message</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-grey uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-grey uppercase tracking-wider md:table-cell hidden">Timestamp (PKT)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-grey uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-gray-200">
              {feedbackList.map((feedback) => (
                <tr key={feedback.id} className="hover:bg-orange hover:bg-opacity-50 transition duration-150 ease-in-out">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 sm:table-cell hidden">{feedback.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{feedback.email}</td>
                  <td className="px-4 py-3 text-left text-sm text-gray-900 lg:table-cell hidden">{feedback.message}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <select
                      className={`block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                        statusUpdates[feedback.id] === 'pending' || feedback.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        statusUpdates[feedback.id] === 'resolved' || feedback.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                      value={statusUpdates[feedback.id] || feedback.status}
                      onChange={(e) => handleStatusChange(feedback.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="ignored">Ignored</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 md:table-cell hidden">{feedback.timestamp}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    {statusUpdates[feedback.id] !== undefined && statusUpdates[feedback.id] !== feedback.status && (
                      <button
                        onClick={() => saveStatusUpdate(feedback.id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-indigo-500 text-indigo-700 text-xs font-medium rounded hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}