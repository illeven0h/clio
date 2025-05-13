"use client";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getApp } from "firebase/app";

export default function AdminCommentsPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const app = getApp();
        const firestore = getFirestore(app);
        const commentsRef = collection(firestore, "comments");
        const snapshot = await getDocs(commentsRef);
        const commentList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp
            ? new Date(
                doc.data().timestamp.seconds * 1000
              ).toLocaleString("en-PK", {
                timeZone: "Asia/Karachi",
              })
            : "N/A",
        }));
        setComments(commentList);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setError("Unable to load comments.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleDeleteComment = async (id) => {
    try {
      const app = getApp();
      const firestore = getFirestore(app);
      await deleteDoc(doc(firestore, "comments", id));
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete comment:", err);
      setError("Unable to delete comment.");
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading comments...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* <h1 className="text-3xl font-bold text-gray-800 mb-8">
          🛠 Admin Dashboard – User Comments
        </h1> */}

        {comments.length === 0 ? (
          <p className="text-grey text-lg">No comments found.</p>
        ) : (
          <div className="space-y-5">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-background p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-lg font-bold text-white">
                      {comment.userName
                        ? comment.userName.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        {comment.userName || "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {comment.timestamp}
                      </span>
                      <p className="mt-3 text-gray-700 text-sm">{comment.text}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        <p>🎞 Video ID: {comment.videoId}</p>
                        <p>👤 User ID: {comment.userId}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-600 text-sm hover:text-red-800 transition"
                    title="Delete comment"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
