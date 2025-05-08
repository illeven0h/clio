"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import {
  getDoc,
  getDocs,
  doc,
  collection,
} from "firebase/firestore";
import { initializeFirebase } from "../../../firebase/initFirebase";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState([]);
  const router = useRouter();
  const { firestore } = initializeFirebase();

  useEffect(() => {
    const checkRole = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const userRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists() || userDoc.data().role !== "admin") {
          router.push("/unauthorized");
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error("Error checking user role:", error);
        router.push("/unauthorized");
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [firestore, router]);

  useEffect(() => {
    if (!authorized) return;

    const fetchUserStats = async () => {
      try {
        const usersSnapshot = await getDocs(collection(firestore, "users"));
        const stats = [];

        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          const name = userDoc.data().name || "Unknown";

          const likesSnapshot = await getDocs(collection(firestore, `users/${userId}/likes`));
          const commentsSnapshot = await getDocs(collection(firestore, `users/${userId}/comments`));

          stats.push({
            userId,
            name,
            likes: likesSnapshot.size,
            comments: commentsSnapshot.size,
          });
        }

        setUserStats(stats);
      } catch (err) {
        console.error("Failed to fetch user stats:", err);
      }
    };

    fetchUserStats();
  }, [authorized, firestore]);

  if (loading || !authorized) return null;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mb-6">You have full access to the platform. Below is user activity:</p>

      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">User ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Likes</th>
            <th className="border px-4 py-2">Comments</th>
          </tr>
        </thead>
        <tbody>
          {userStats.map((user) => (
            <tr key={user.userId}>
              <td className="border px-4 py-2">{user.userId}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.likes}</td>
              <td className="border px-4 py-2">{user.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
