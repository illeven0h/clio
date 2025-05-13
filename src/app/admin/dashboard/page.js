"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function AdminDashboard() {
  const router = useRouter();

  const [videos, setVideos] = useState([]);
  const [likes, setLikes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded admin check for demonstration (replace with your own auth logic)
  const isAdmin = true;

  // Load dummy data
  useEffect(() => {
    setLoading(true);

    const dummyVideos = [
      { createdAt: { seconds: 1714608000 }, prompt: "JS", userId: "user1" },      // May 2
      { createdAt: { seconds: 1714694400 }, prompt: "React", userId: "user2" },   // May 3
      { createdAt: { seconds: 1714780800 }, prompt: "JS", userId: "user1" },      // May 4
      { createdAt: { seconds: 1714867200 }, prompt: "Next.js", userId: "user3" }, // May 5
      { createdAt: { seconds: 1714867200 }, prompt: "HTML", userId: "user2" },    // May 5
      { createdAt: { seconds: 1714953600 }, prompt: "HTML", userId: "user1" },    // May 6
    ];

    const dummyLikes = [
      { userId: "user1" }, { userId: "user2" }, { userId: "user3" }, { userId: "user1" }, { userId: "user2" }
    ];

    const dummyUsers = [
      { uid: "user1", role: "user" },
      { uid: "user2", role: "user" },
      { uid: "user3", role: "user" }
    ];

    setVideos(dummyVideos.map(v => ({
      ...v,
      createdAt: {
        toDate: () => new Date(v.createdAt.seconds * 1000)
      }
    })));
    setLikes(dummyLikes);
    setUsers(dummyUsers);

    setLoading(false);
  }, []);

  // Function to handle Reports button click
  const handleReportsClick = () => {
    router.push("/admin-reports");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-transparent text-orange-600 text-lg">
        Loading admin data...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-transparent text-red-600 text-lg">
        Access Denied: You do not have admin privileges.
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

  const getTopUsersByVideos = () => {
    const userMap = {};
    videos.forEach(v => {
      if (!v.userId) return;
      userMap[v.userId] = (userMap[v.userId] || 0) + 1;
    });
    return {
      labels: Object.keys(userMap),
      counts: Object.values(userMap)
    };
  };

  const { labels, counts } = getDailyCounts();
  const promptStats = getPromptStats();
  const topUsers = getTopUsersByVideos();

  // Chart options for a transparent look
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#4b5563', // Adjusted for potential light background
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.8)', // Semi-transparent tooltip
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#4b5563',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#4b5563' }
      },
      y: {
        grid: { color: '#d1d5db' },
        ticks: { color: '#4b5563' }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* <h1 className="text-3xl font-bold">Admin Dashboard</h1> */}
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            {/* <button
              onClick={handleReportsClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Reports
            </button> */}
          </div>
        </header>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-5 bg-transparent rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-300">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.5 4.5M15 10l-4.5 4.5M9 10l-4.5 4.5M9 10l4.5 4.5" />
              </svg>
              <div>
                <h2 className="text-sm text-gray-500">Total Videos</h2>
                <p className="text-2xl font-semibold text-blue-600">{videos.length}</p>
              </div>
            </div>
          </div>
          <div className="p-5 bg-transparent rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-300">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
              <div>
                <h2 className="text-sm text-gray-500">Total Likes</h2>
                <p className="text-2xl font-semibold text-green-600">{likes.length}</p>
              </div>
            </div>
          </div>
          <div className="p-5 bg-transparent rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-300">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <div>
                <h2 className="text-sm text-gray-500">Total Prompts</h2>
                <p className="text-2xl font-semibold text-indigo-600">
                  {videos.reduce((acc, v) => acc + (v.prompt ? 1 : 0), 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 bg-transparent rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-300">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <div>
                <h2 className="text-sm text-gray-500">Total Users</h2>
                <p className="text-2xl font-semibold text-purple-600">{users.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="p-5 bg-transparent rounded-lg shadow-lg border border-gray-300 h-[350px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Videos Over Time (All Users)</h2>
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: "Videos",
                    data: counts,
                    borderColor: "#ff9800",
                    backgroundColor: "transparent",
                    tension: 0.3,
                    fill: false
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>

          {/* Bar Chart */}
          <div className="p-5 bg-transparent rounded-lg shadow-lg border border-gray-300 h-[350px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Top Users by Videos</h2>
            <Bar
              data={{
                labels: topUsers.labels,
                datasets: [
                  {
                    label: "Videos",
                    data: topUsers.counts,
                    backgroundColor: "rgba(3, 169, 244, 0.2)",
                    borderColor: "#03a9f4",
                    borderWidth: 1
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>

          {/* Pie Chart */}
          <div className="p-5 bg-transparent rounded-lg shadow-lg border border-gray-300 h-[350px] col-span-1 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Prompt Usage (All Users)</h2>
            <Pie
              data={{
                labels: promptStats.labels,
                datasets: [
                  {
                    data: promptStats.counts,
                    backgroundColor: ["#ff9800", "#03a9f4", "#8bc34a", "#e91e63"],
                    borderColor: 'transparent',
                    borderWidth: 0
                  },
                ],
              }}
              options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { position: 'bottom' } } }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}