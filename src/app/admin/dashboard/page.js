"use client";
import { useEffect, useState, Component } from "react";
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
  Legend,
} from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";

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

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex items-center justify-center h-screen text-red-500">
          <p>Error: {this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AdminDashboard() {
  const [videos, setVideos] = useState([]);
  const [likes, setLikes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded admin check
  const isAdmin = true;

  // Load dummy data
  useEffect(() => {
    setLoading(true);

    const dummyVideos = [
      { id: "vid1", createdAt: { seconds: 1714096800 }, prompt: "Marketing", userId: "user1" }, // April 26, 2025
      { id: "vid2", createdAt: { seconds: 1714521600 }, prompt: "Education", userId: "user2" }, // May 1, 2025
      { id: "vid3", createdAt: { seconds: 1714953600 }, prompt: "Technology", userId: "user1" }, // May 6, 2025
      { id: "vid4", createdAt: { seconds: 1715040000 }, prompt: "Lifestyle", userId: "user3" }, // May 7, 2025
      { id: "vid5", createdAt: { seconds: 1715126400 }, prompt: "Entertainment", userId: "user2" }, // May 8, 2025
      { id: "vid6", createdAt: { seconds: 1715472000 }, prompt: "Marketing", userId: "user1" }, // May 12, 2025
    ];

    const dummyLikes = [
      { videoId: "vid1", userId: "user1", likes: 200, createdAt: { seconds: 1714096800 } }, // April 26, 2025
      { videoId: "vid2", userId: "user2", likes: 150, createdAt: { seconds: 1714521600 } }, // May 1, 2025
      { videoId: "vid3", userId: "user1", likes: 280, createdAt: { seconds: 1714953600 } }, // May 6, 2025
      { videoId: "vid4", userId: "user3", likes: 90, createdAt: { seconds: 1715040000 } }, // May 7, 2025
      { videoId: "vid5", userId: "user2", likes: 170, createdAt: { seconds: 1715126400 } }, // May 8, 2025
      { videoId: "vid6", userId: "user1", likes: 220, createdAt: { seconds: 1715472000 } }, // May 12, 2025
    ];

    const dummyUsers = [
      { id: "user1", email: "user1@example.com", role: "user" },
      { id: "user2", email: "user2@example.com", role: "user" },
      { id: "user3", email: "user3@example.com", role: "admin" },
      { id: "user4", email: "user4@example.com", role: "user" },
    ];

    setVideos(dummyVideos.map((v) => ({
      ...v,
      createdAt: {
        toDate: () => new Date(v.createdAt.seconds * 1000),
      },
    })));
    setLikes(dummyLikes.map((l) => ({
      ...l,
      createdAt: {
        toDate: () => new Date(l.createdAt.seconds * 1000),
      },
    })));
    setUsers(dummyUsers);

    setLoading(false);
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-orange-500 text-lg">
        Loading admin data...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg">
        Access Denied: You do not have admin privileges.
      </div>
    );
  }

  // Analytics calculations
  const getDailyCounts = () => {
    const countMap = {};
    videos.forEach((video) => {
      if (!video?.createdAt?.toDate) return;
      const date = format(video.createdAt.toDate(), "MMM d");
      countMap[date] = (countMap[date] || 0) + 1;
    });
    return {
      labels: Object.keys(countMap),
      counts: Object.values(countMap),
    };
  };

  const getPromptStats = () => {
    const map = {};
    videos.forEach((v) => {
      if (!v?.prompt) return;
      map[v.prompt] = (map[v.prompt] || 0) + 1;
    });
    return {
      labels: Object.keys(map),
      counts: Object.values(map),
    };
  };

  const getUserStats = () => {
    const userMap = {};
    videos.forEach((v) => {
      if (!v.userId) return;
      userMap[v.userId] = (userMap[v.userId] || 0) + 1;
    });
    return {
      labels: Object.keys(userMap),
      counts: Object.values(userMap),
    };
  };

  const getEngagementStats = () => {
    const labels = likes.map((like) => videos.find((v) => v.id === like.videoId)?.prompt || "Unknown");
    const likesData = likes.map((like) => like.likes || 0);
    return { labels, likes: likesData };
  };

  const getUserRoleStats = () => {
    const roleMap = { Admin: 0, User: 0 };
    users.forEach((user) => {
      if (user.role === "admin") {
        roleMap.Admin += 1;
      } else {
        roleMap.User += 1;
      }
    });
    return {
      labels: Object.keys(roleMap),
      counts: Object.values(roleMap),
    };
  };

  const getCumulativeLikes = () => {
    const dailyLikes = {};
    likes.forEach((like) => {
      if (!like?.createdAt?.toDate) return;
      const date = format(like.createdAt.toDate(), "MMM d");
      dailyLikes[date] = (dailyLikes[date] || 0) + (like.likes || 0);
    });

    const labels = Object.keys(dailyLikes);
    let cumulative = 0;
    const counts = labels.map((label) => {
      cumulative += dailyLikes[label] || 0;
      return cumulative;
    });

    return { labels, counts };
  };

  let dailyLabels, dailyCounts, promptStats, userStats, engagementStats, roleStats, cumulativeLikesLabels, cumulativeLikesCounts;
  try {
    ({ labels: dailyLabels, counts: dailyCounts } = getDailyCounts());
    promptStats = getPromptStats();
    userStats = getUserStats();
    engagementStats = getEngagementStats();
    roleStats = getUserRoleStats();
    ({ labels: cumulativeLikesLabels, counts: cumulativeLikesCounts } = getCumulativeLikes());
  } catch (err) {
    setError("Failed to calculate analytics: " + err.message);
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // Dynamic insights
  const getVideosOverTimeInsight = () => {
    if (!videos.length) return "No videos created.";
    const maxVideos = dailyCounts.length ? Math.max(...dailyCounts) : 0;
    if (maxVideos === 0) return "No videos created.";
    const maxDate = dailyLabels[dailyCounts.indexOf(maxVideos)] || "unknown";
    return `Most videos were created on ${maxDate}, with ${maxVideos} video(s).`;
  };

  const getPromptUsageInsight = () => {
    if (!videos.length) return "No prompts used.";
    const uniquePrompts = promptStats.labels.length || 0;
    if (uniquePrompts === 0) return "No prompts used.";
    return `${uniquePrompts} unique prompt${uniquePrompts === 1 ? "" : "s"} used, showing ${uniquePrompts > 1 ? "diverse" : "focused"} content creation.`;
  };

  const getUserStatsInsight = () => {
    if (!videos.length) return "No user activity.";
    const maxVideos = userStats.counts.length ? Math.max(...userStats.counts) : 0;
    if (maxVideos === 0) return "No user activity.";
    const topUser = userStats.labels[userStats.counts.indexOf(maxVideos)] || "unknown";
    return `User ${topUser} created the most videos (${maxVideos}).`;
  };

  const getEngagementInsight = () => {
    if (!likes.length) return "No engagement data available.";
    const maxLikes = engagementStats.likes.length ? Math.max(...engagementStats.likes) : 0;
    if (maxLikes === 0) return "No engagement data available.";
    const maxLikesIndex = engagementStats.likes.indexOf(maxLikes);
    const topVideo = engagementStats.labels[maxLikesIndex] || "unknown";
    return `${topVideo} leads with ${maxLikes} likes.`;
  };

  const getUserRoleInsight = () => {
    if (!users.length) return "No users in the system.";
    const adminCount = roleStats.counts[0] || 0;
    const total = (roleStats.counts[0] || 0) + (roleStats.counts[1] || 0);
    const adminPercentage = total ? Math.round((adminCount / total) * 100) : 0;
    if (total === 0) return "No users in the system.";
    return `${adminPercentage}% of users are admins, indicating ${adminPercentage > 50 ? "high" : "low"} administrative presence.`;
  };

  const getCumulativeLikesInsight = () => {
    if (!likes.length) return "No likes recorded.";
    const totalLikes = cumulativeLikesCounts[cumulativeLikesCounts.length - 1] || 0;
    if (totalLikes === 0) return "No likes recorded.";
    const endDate = cumulativeLikesLabels[cumulativeLikesCounts.length - 1] || "the period";
    return `Likes have grown to ${totalLikes} by ${endDate}.`;
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 12, family: "Arial" } },
      },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
        title: { display: true, font: { size: 14 } },
      },
      y: {
        grid: { color: "rgba(0,0,0,0.1)" },
        title: { display: true, font: { size: 14 } },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuad",
    },
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen p-10">
        {/* Inline CSS */}
        <style jsx>{`
          canvas {
            background: transparent !important;
          }
        `}</style>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded text-center border border-gray-300 dark:border-gray-700 bg-transparent shadow">
            <h2 className="text-sm text-gray-500">Videos Generated</h2>
            <p className="text-2xl font-bold text-gray-800">{videos.length}</p>
          </div>
          <div className="p-6 rounded text-center border border-gray-300 dark:border-gray-700 bg-transparent shadow">
            <h2 className="text-sm text-gray-500">Total Users</h2>
            <p className="text-2xl font-bold text-gray-800">{users.length}</p>
          </div>
          <div className="p-6 rounded text-center border border-gray-300 dark:border-gray-700 bg-transparent shadow">
            <h2 className="text-sm text-gray-500">Total Likes</h2>
            <p className="text-2xl font-bold text-gray-800">
              {likes.reduce((sum, a) => sum + (a.likes || 0), 0)}
            </p>
          </div>
          <div className="p-6 rounded text-center border border-gray-300 dark:border-gray-700 bg-transparent shadow">
            <h2 className="text-sm text-gray-500">Total Videos</h2>
            <p className="text-2xl font-bold text-gray-800">{videos.length}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">System Analytics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Line Chart: Videos Over Time */}
            <div className="p-4 rounded border border-gray-300 dark:border-gray-700 bg-transparent shadow-sm">
              <h3 className="text-sm font-semibold mb-2 text-gray-800">Videos Created Over Time</h3>
              <p className="text-xs text-gray-600 mb-4">Number of videos created each day.</p>
              <div style={{ height: "250px" }}>
                <Line
                  data={{
                    labels: dailyLabels || [],
                    datasets: [
                      {
                        label: "Videos",
                        data: dailyCounts || [],
                        borderColor: "#ff9800",
                        backgroundColor: "rgba(255, 152, 0, 0.2)",
                        fill: true,
                        tension: 0.3,
                        pointBackgroundColor: "#ff9800",
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "#ff9800",
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    scales: {
                      x: { ...chartOptions.scales.x, title: { display: true, text: "Date" } },
                      y: { ...chartOptions.scales.y, title: { display: true, text: "Videos" } },
                    },
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-4">{getVideosOverTimeInsight()}</p>
            </div>

            {/* Bar Chart: Engagement by Video */}
            <div className="p-4 rounded border border-gray-300 dark:border-gray-700 bg-transparent shadow-sm">
              <h3 className="text-sm font-semibold mb-2 text-gray-800">Likes by Video</h3>
              <p className="text-xs text-gray-600 mb-4">Likes for each video prompt.</p>
              <div style={{ height: "250px" }}>
                <Bar
                  data={{
                    labels: engagementStats.labels || [],
                    datasets: [
                      {
                        label: "Likes",
                        data: engagementStats.likes || [],
                        backgroundColor: "#8bc34a",
                        borderColor: "#689f38",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    scales: {
                      x: { ...chartOptions.scales.x, title: { display: true, text: "Prompt" } },
                      y: { ...chartOptions.scales.y, title: { display: true, text: "Likes" } },
                    },
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-4">{getEngagementInsight()}</p>
            </div>

            {/* Pie Chart: Prompt Usage Distribution */}
            <div className="p-4 rounded border border-gray-300 dark:border-gray-700 bg-transparent shadow-sm">
              <h3 className="text-sm font-semibold mb-2 text-gray-800">Prompt Usage Distribution</h3>
              <p className="text-xs text-gray-600 mb-4">Distribution of video prompt types.</p>
              <div style={{ height: "250px" }}>
                <Pie
                  data={{
                    labels: promptStats.labels || [],
                    datasets: [
                      {
                        data: promptStats.counts || [],
                        backgroundColor: ["#ff9800", "#03a9f4", "#8bc34a", "#e91e63", "#9c27b0"],
                        borderColor: ["#fff"],
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: { position: "right" },
                    },
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-4">{getPromptUsageInsight()}</p>
            </div>

            {/* Bar Chart: Videos by User */}
            <div className="p-4 rounded border border-gray-300 dark:border-gray-700 bg-transparent shadow-sm">
              <h3 className="text-sm font-semibold mb-2 text-gray-800">Videos by User</h3>
              <p className="text-xs text-gray-600 mb-4">Number of videos created by each user.</p>
              <div style={{ height: "250px" }}>
                <Bar
                  data={{
                    labels: userStats.labels || [],
                    datasets: [
                      {
                        label: "Videos",
                        data: userStats.counts || [],
                        backgroundColor: "#03a9f4",
                        borderColor: "#0288d1",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    scales: {
                      x: { ...chartOptions.scales.x, title: { display: true, text: "User ID" } },
                      y: { ...chartOptions.scales.y, title: { display: true, text: "Videos" } },
                    },
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-4">{getUserStatsInsight()}</p>
            </div>

            {/* Doughnut Chart: User Role Distribution */}
            <div className="p-4 rounded border border-gray-300 dark:border-gray-700 bg-transparent shadow-sm">
              <h3 className="text-sm font-semibold mb-2 text-gray-800">User Role Distribution</h3>
              <p className="text-xs text-gray-600 mb-4">Proportion of admin vs. user roles.</p>
              <div style={{ height: "250px" }}>
                <Doughnut
                  data={{
                    labels: roleStats.labels || [],
                    datasets: [
                      {
                        data: roleStats.counts || [],
                        backgroundColor: ["#03a9f4", "#e91e63"],
                        borderColor: ["#fff"],
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: { position: "right" },
                    },
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-4">{getUserRoleInsight()}</p>
            </div>

            {/* Line Chart: Cumulative Likes Over Time */}
            <div className="p-4 rounded border border-gray-300 dark:border-gray-700 bg-transparent shadow-sm">
              <h3 className="text-sm font-semibold mb-2 text-gray-800">Cumulative Likes Over Time</h3>
              <p className="text-xs text-gray-600 mb-4">Total likes accumulated over time.</p>
              <div style={{ height: "250px" }}>
                <Line
                  data={{
                    labels: cumulativeLikesLabels || [],
                    datasets: [
                      {
                        label: "Cumulative Likes",
                        data: cumulativeLikesCounts || [],
                        borderColor: "#e91e63",
                        backgroundColor: "rgba(233, 30, 99, 0.2)",
                        fill: true,
                        tension: 0.3,
                        pointBackgroundColor: "#e91e63",
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "#e91e63",
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    scales: {
                      x: { ...chartOptions.scales.x, title: { display: true, text: "Date" } },
                      y: { ...chartOptions.scales.y, title: { display: true, text: "Likes" } },
                    },
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-4">{getCumulativeLikesInsight()}</p>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}