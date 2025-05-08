"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../firebase/auth";
import { useRouter } from "next/navigation";
import { initializeFirebase } from "../../../../../firebase/initFirebase";
import {
  getDocs, query, collection, where
} from "firebase/firestore";
import { format } from "date-fns";

// Chart.js
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { firestore } = initializeFirebase();

  const [videos, setVideos] = useState([]);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  const useDummyData = true;

  useEffect(() => {
    if (currentUser === undefined) return;
    if (!currentUser) router.push("/");
  }, [currentUser, router]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (useDummyData) {
          const dummyVideos = [
            { createdAt: { seconds: 1714608000 }, prompt: "JS" },      // May 2
            { createdAt: { seconds: 1714694400 }, prompt: "React" },   // May 3
            { createdAt: { seconds: 1714780800 }, prompt: "JS" },      // May 4
            { createdAt: { seconds: 1714867200 }, prompt: "Next.js" }, // May 5
            { createdAt: { seconds: 1714867200 }, prompt: "HTML" },    // May 5
            { createdAt: { seconds: 1714953600 }, prompt: "HTML" },    // May 6
          ];

          const dummyLikes = [{}, {}, {}, {}, {}];

          setVideos(dummyVideos.map(v => ({
            ...v,
            createdAt: {
              toDate: () => new Date(v.createdAt.seconds * 1000)
            }
          })));
          setLikes(dummyLikes);
        } else {
          const videoQuery = query(
            collection(firestore, "videos"),
            where("userId", "==", currentUser.uid)
          );
          const likeQuery = query(
            collection(firestore, "likes"),
            where("userId", "==", currentUser.uid)
          );
          const [videoSnap, likeSnap] = await Promise.all([
            getDocs(videoQuery),
            getDocs(likeQuery)
          ]);
          setVideos(videoSnap.docs.map(doc => doc.data()));
          setLikes(likeSnap.docs.map(doc => doc.data()));
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, firestore]);

  if (currentUser === undefined || loading) {
    return (
      <div className="flex items-center justify-center h-screen text-orange text-lg">
        {loading ? "Loading your data..." : "Checking authentication..."}
      </div>
    );
  }

  const getDailyCounts = () => {
    const countMap = {};
    videos.forEach((video) => {
      if (!video.createdAt) return;
      const date = format(video.createdAt.toDate(), "MMM d");
      countMap[date] = (countMap[date] || 0) + 1;
    });
    return {
      labels: Object.keys(countMap),
      counts: Object.values(countMap)
    };
  };

  const getPromptStats = () => {
    const map = {};
    videos.forEach(v => {
      if (!v.prompt) return;
      map[v.prompt] = (map[v.prompt] || 0) + 1;
    });
    return {
      labels: Object.keys(map),
      counts: Object.values(map)
    };
  };

  const { labels, counts } = getDailyCounts();
  const promptStats = getPromptStats();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Your Activity Dashboard</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded text-center border border-gray-300 dark:border-gray-700 bg-transparent">
          <h2 className="text-sm text-gray-500">Videos Generated</h2>
          <p className="text-2xl font-bold">{videos.length}</p>
        </div>
        <div className="p-6 rounded text-center border border-gray-300 dark:border-gray-700 bg-transparent">
          <h2 className="text-sm text-gray-500">Likes Given</h2>
          <p className="text-2xl font-bold">{likes.length}</p>
        </div>
        <div className="p-6 rounded text-center border border-gray-300 dark:border-gray-700 bg-transparent">
          <h2 className="text-sm text-gray-500">Prompts Used</h2>
          <p className="text-2xl font-bold">
            {videos.reduce((acc, v) => acc + (v.prompt ? 1 : 0), 0)}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="p-4 rounded border border-gray-300 dark:border-gray-700 bg-transparent">
          <h2 className="text-sm font-semibold mb-2">Videos Over Time</h2>
          <div style={{ height: "200px" }}>
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: "Videos",
                    data: counts,
                    borderColor: "#ff9800",
                    tension: 0.3,
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="p-4 rounded border border-gray-300 dark:border-gray-700 bg-transparent">
          <h2 className="text-sm font-semibold mb-2">Likes Over Time</h2>
          <div style={{ height: "200px" }}>
            <Bar
              data={{
                labels: ["May 2", "May 3", "May 4", "May 5", "May 6"],
                datasets: [
                  {
                    label: "Likes",
                    data: [1, 1, 0, 2, 1],
                    backgroundColor: "#03a9f4",
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="p-4 rounded border border-gray-300 dark:border-gray-700 bg-transparent col-span-1 sm:col-span-2">
          <h2 className="text-sm font-semibold mb-2">Prompt Usage</h2>
          <div style={{ height: "200px" }}>
            <Pie
              data={{
                labels: promptStats.labels,
                datasets: [
                  {
                    data: promptStats.counts,
                    backgroundColor: ["#ff9800", "#03a9f4", "#8bc34a", "#e91e63"],
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
