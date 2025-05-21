"use client";
import { useEffect, useState, Component } from "react";
import { useAuth } from "../../../../../firebase/auth";
import { useRouter } from "next/navigation";
import { initializeFirebase } from "../../../../../firebase/initFirebase";
import { getDocs, query, collection, where } from "firebase/firestore";
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
  ScatterController,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie, Doughnut, Scatter } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  ScatterController,
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

export default function Dashboard() {
  const { currentUser } = useAuth() || {};
  const router = useRouter();
  const { firestore } = initializeFirebase() || {};

  const [videos, setVideos] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [filteredAnalytics, setFilteredAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const useDummyData = true;

  // Color palette for charts (ensures unique colors for all prompts)
  const chartColors = [
    "#ff9800", // Orange
    "#03a9f4", // Blue
    "#8bc34a", // Green
    "#e91e63", // Pink
    "#673ab7", // Purple
    "#ffeb3b", // Yellow
    "#795548", // Brown
    "#00bcd4", // Cyan
    "#f44336", // Red
  ];

  useEffect(() => {
    console.log("Checking auth:", { currentUser });
    if (currentUser === undefined) return;
    if (!currentUser) {
      console.log("No user, redirecting to /");
      router.push("/");
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (!currentUser || !firestore) {
      console.log("Missing user or firestore, skipping fetch");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Fetching data...");
        if (useDummyData) {
          const dummyVideos = [
            {
              videoId: "vid001",
              title: "Summer Sale Ad",
              prompt: "Retail Sale",
              createdAt: { seconds: 1713916800 }, // April 24, 2025
              visibility: true,
              metadata: { tags: ["sale", "summer"], duration: 30, fileSize: "12MB" },
            },
            {
              videoId: "vid002",
              title: "Tech Product Launch",
              prompt: "Tech Launch",
              createdAt: { seconds: 1714435200 }, // April 30, 2025
              visibility: false,
              metadata: { tags: ["tech", "product"], duration: 45, fileSize: "15MB" },
            },
            {
              videoId: "vid003",
              title: "Fitness Campaign",
              prompt: "Fitness",
              createdAt: { seconds: 1714694400 }, // May 3, 2025
              visibility: true,
              metadata: { tags: ["fitness", "health"], duration: 20, fileSize: "8MB" },
            },
            {
              videoId: "vid004",
              title: "Travel Promo",
              prompt: "Travel",
              createdAt: { seconds: 1715472000 }, // May 12, 2025
              visibility: true,
              metadata: { tags: ["travel", "adventure"], duration: 25, fileSize: "10MB" },
            },
            {
              videoId: "vid005",
              title: "Food Festival",
              prompt: "Food",
              createdAt: { seconds: 1715558400 }, // May 13, 2025
              visibility: false,
              metadata: { tags: ["food", "event"], duration: 35, fileSize: "14MB" },
            },
            {
              videoId: "vid006",
              title: "Product Reveal",
              prompt: "Product",
              createdAt: { seconds: 1715644800 }, // May 14, 2025
              visibility: true,
              metadata: { tags: ["product", "launch"], duration: 40, fileSize: "16MB" },
            },
          ];

          const dummyAnalytics = [
            { videoId: "vid001", views: 2500, likes: 200, shares: 50 },
            { videoId: "vid002", views: 1800, likes: 150, shares: 30 },
            { videoId: "vid003", views: 3200, likes: 280, shares: 70 },
            { videoId: "vid004", views: 1200, likes: 90, shares: 20 },
            { videoId: "vid005", views: 2100, likes: 170, shares: 40 },
            { videoId: "vid006", views: 1500, likes: 110, shares: 25 },
          ];

          const formattedVideos = dummyVideos.map((v) => ({
            ...v,
            createdAt: {
              toDate: () => new Date(v.createdAt.seconds * 1000),
            },
          }));

          console.log("Dummy data set:", { videos: formattedVideos, analytics: dummyAnalytics });
          setVideos(formattedVideos);
          setAnalytics(dummyAnalytics);
        } else {
          console.log("Fetching from Firebase...");
          const videoQuery = query(
            collection(firestore, "videos"),
            where("userId", "==", currentUser.uid)
          );
          const analyticsQuery = query(
            collection(firestore, "analytics"),
            where("userId", "==", currentUser.uid)
          );
          const [videoSnap, analyticsSnap] = await Promise.all([
            getDocs(videoQuery),
            getDocs(analyticsQuery),
          ]);
          const fetchedVideos = videoSnap.docs.map((doc) => doc.data());
          const fetchedAnalytics = analyticsSnap.docs.map((doc) => doc.data());
          console.log("Firebase data fetched:", { videos: fetchedVideos, analytics: fetchedAnalytics });
          setVideos(fetchedVideos);
          setAnalytics(fetchedAnalytics);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, firestore]);

  // Set filtered data to all videos and analytics (no time filter)
  useEffect(() => {
    setFilteredVideos([...videos]); // Show all videos
    setFilteredAnalytics([...analytics]); // Show all analytics
  }, [videos, analytics]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (currentUser === undefined || loading) {
    return (
      <div className="flex items-center justify-center h-screen text-orange-500 text-lg">
        {loading ? "Loading your data..." : "Checking authentication..."}
      </div>
    );
  }

  // Analytics calculations
  const getDailyCounts = (videos) => {
    const countMap = {};
    (videos || []).forEach((video) => {
      if (!video?.createdAt?.toDate) return;
      const date = format(video.createdAt.toDate(), "MMM d");
      countMap[date] = (countMap[date] || 0) + 1;
    });
    return {
      labels: Object.keys(countMap),
      counts: Object.values(countMap),
    };
  };

  const getPromptStats = (videos) => {
    const map = {};
    (videos || []).forEach((v) => {
      if (!v?.prompt) return;
      map[v.prompt] = (map[v.prompt] || 0) + 1;
    });
    return {
      labels: Object.keys(map),
      counts: Object.values(map),
    };
  };

  const getEngagementStats = (videos, analytics) => {
    const labels = (analytics || []).map((a) => (videos || []).find((v) => v.videoId === a.videoId)?.title || "Unknown");
    const views = (analytics || []).map((a) => a.views || 0);
    const likes = (analytics || []).map((a) => a.likes || 0);
    const shares = (analytics || []).map((a) => a.shares || 0);
    return { labels, views, likes, shares };
  };

  const getCumulativeViews = (videos, analytics) => {
    const dailyViews = {};
    (videos || []).forEach((video) => {
      if (!video?.createdAt?.toDate) return;
      const date = format(video.createdAt.toDate(), "MMM d");
      const views = (analytics || []).find((a) => a.videoId === video.videoId)?.views || 0;
      dailyViews[date] = (dailyViews[date] || 0) + views;
    });

    const labels = Object.keys(dailyViews);
    let cumulative = 0;
    const counts = labels.map((label) => {
      cumulative += dailyViews[label] || 0;
      return cumulative;
    });

    return { labels, counts };
  };

  const getDurationVsEngagement = (videos, analytics) => {
    return (videos || []).map((video) => {
      const engagement = (analytics || []).find((a) => a.videoId === video.videoId)?.likes || 0;
      return {
        x: video.metadata?.duration || 0,
        y: engagement,
      };
    });
  };

  const getVisibilityStats = (videos) => {
    const visibilityMap = { Public: 0, Private: 0 };
    (videos || []).forEach((video) => {
      if (video?.visibility !== undefined) {
        visibilityMap[video.visibility ? "Public" : "Private"] += 1;
      }
    });
    return {
      labels: Object.keys(visibilityMap),
      counts: Object.values(visibilityMap),
    };
  };

  let dailyLabels, dailyCounts, promptStats, engagementStats, cumulativeLabels, cumulativeCounts, durationVsEngagement, visibilityStats;
  try {
    console.log("Calculating analytics...");
    ({ labels: dailyLabels, counts: dailyCounts } = getDailyCounts(filteredVideos));
    promptStats = getPromptStats(filteredVideos);
    engagementStats = getEngagementStats(filteredVideos, filteredAnalytics);
    ({ labels: cumulativeLabels, counts: cumulativeCounts } = getCumulativeViews(filteredVideos, filteredAnalytics));
    durationVsEngagement = getDurationVsEngagement(filteredVideos, filteredAnalytics);
    visibilityStats = getVisibilityStats(filteredVideos);
    console.log("Analytics calculated:", { dailyLabels, dailyCounts, promptStats, engagementStats });
  } catch (err) {
    console.error("Analytics calculation error:", err);
    setError("Failed to calculate analytics: " + err.message);
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // Function to generate and download the report
  const downloadReport = () => {
    try {
      // Summary Stats
      const totalVideos = filteredVideos.length;
      const totalViews = (filteredAnalytics || []).reduce((sum, a) => sum + (a.views || 0), 0);
      const totalLikes = (filteredAnalytics || []).reduce((sum, a) => sum + (a.likes || 0), 0);
      const totalShares = (filteredAnalytics || []).reduce((sum, a) => sum + (a.shares || 0), 0);

      // Report content
      let reportContent = "=== Dashboard Report ===\n\n";
      reportContent += "Generated on: " + new Date().toISOString() + "\n\n";

      reportContent += "== Summary Stats ==\n";
      reportContent += `Videos Generated: ${totalVideos}\n`;
      reportContent += `Total Views: ${totalViews}\n`;
      reportContent += `Total Likes: ${totalLikes}\n`;
      reportContent += `Total Shares: ${totalShares}\n\n`;

      // Videos Created Over Time
      reportContent += "== Videos Created Over Time ==\n";
      dailyLabels.forEach((label, index) => {
        reportContent += `${label}: ${dailyCounts[index]} videos\n`;
      });
      reportContent += `Insight: ${getVideosOverTimeInsight()}\n\n`;

      // Engagement by Video
      reportContent += "== Engagement by Video ==\n";
      engagementStats.labels.forEach((label, index) => {
        reportContent += `${label}:\n`;
        reportContent += `  Views: ${engagementStats.views[index]}\n`;
        reportContent += `  Likes: ${engagementStats.likes[index]}\n`;
        reportContent += `  Shares: ${engagementStats.shares[index]}\n`;
      });
      reportContent += `Insight: ${getEngagementInsight()}\n\n`;

      // Cumulative Views Over Time
      reportContent += "== Cumulative Views Over Time ==\n";
      cumulativeLabels.forEach((label, index) => {
        reportContent += `${label}: ${cumulativeCounts[index]} views\n`;
      });
      reportContent += `Insight: ${getCumulativeViewsInsight()}\n\n`;

      // Prompt Usage Distribution
      reportContent += "== Prompt Usage Distribution ==\n";
      promptStats.labels.forEach((label, index) => {
        reportContent += `${label}: ${promptStats.counts[index]} videos\n`;
      });
      reportContent += `Insight: ${getPromptUsageInsight()}\n\n`;

      // Duration vs Likes
      reportContent += "== Duration vs Likes ==\n";
      durationVsEngagement.forEach((dataPoint, index) => {
        const video = filteredVideos[index];
        reportContent += `${video.title}:\n`;
        reportContent += `  Duration: ${dataPoint.x} seconds\n`;
        reportContent += `  Likes: ${dataPoint.y}\n`;
      });
      reportContent += `Insight: ${getDurationVsEngagementInsight()}\n\n`;

      // Video Visibility Distribution
      reportContent += "== Video Visibility Distribution ==\n";
      visibilityStats.labels.forEach((label, index) => {
        reportContent += `${label}: ${visibilityStats.counts[index]} videos\n`;
      });
      reportContent += `Insight: ${getVisibilityInsight()}\n`;

      // Create a Blob with the report content
      const blob = new Blob([reportContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      // Create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = "dashboard-report.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error generating report:", err);
      setError("Failed to generate report: " + err.message);
    }
  };

  // Dynamic insights
  const getVideosOverTimeInsight = () => {
    if (!filteredVideos.length) return "No videos created.";
    const maxVideos = dailyCounts.length ? Math.max(...dailyCounts) : 0;
    if (maxVideos === 0) return "No videos created.";
    const maxDate = dailyLabels[dailyCounts.indexOf(maxVideos)] || "unknown";
    return `Most videos were created on ${maxDate}, with ${maxVideos} video(s).`;
  };

  const getEngagementInsight = () => {
    if (!filteredAnalytics.length) return "No engagement data available.";
    const maxViews = engagementStats.views.length ? Math.max(...engagementStats.views) : 0;
    if (maxViews === 0) return "No engagement data available.";
    const maxViewsIndex = engagementStats.views.indexOf(maxViews);
    const topVideo = engagementStats.labels[maxViewsIndex] || "unknown";
    const views = engagementStats.views[maxViewsIndex] || 0;
    const likes = engagementStats.likes[maxViewsIndex] || 0;
    return `${topVideo} leads with ${views} views and ${likes} likes.`;
  };

  const getCumulativeViewsInsight = () => {
    if (!filteredVideos.length) return "No views recorded.";
    const totalViews = cumulativeCounts[cumulativeCounts.length - 1] || 0;
    if (totalViews === 0) return "No views recorded.";
    const endDate = cumulativeLabels[cumulativeCounts.length - 1] || "the period";
    return `Views have grown to ${totalViews} by ${endDate}.`;
  };

  const getPromptUsageInsight = () => {
    if (!filteredVideos.length) return "No prompts used.";
    const uniquePrompts = promptStats.labels.length || 0;
    if (uniquePrompts === 0) return "No prompts used.";
    return `${uniquePrompts} unique prompt${uniquePrompts === 1 ? "" : "s"} used, showing ${uniquePrompts > 1 ? "diverse" : "focused"} content creation.`;
  };

  const getDurationVsEngagementInsight = () => {
    if (!filteredVideos.length) return "No data available.";
    const maxLikes = durationVsEngagement.length ? Math.max(...durationVsEngagement.map((d) => d.y)) : 0;
    if (maxLikes === 0) return "No engagement data available.";
    const topVideo = filteredVideos.find((v) => {
      const likes = filteredAnalytics.find((a) => a.videoId === v.videoId)?.likes || 0;
      return likes === maxLikes;
    });
    return `Videos like ${topVideo?.title || "unknown"} (${maxLikes} likes) show strong engagement.`;
  };

  const getVisibilityInsight = () => {
    if (!filteredVideos.length) return "No videos available.";
    const publicCount = visibilityStats.counts[0] || 0;
    const total = (visibilityStats.counts[0] || 0) + (visibilityStats.counts[1] || 0);
    const publicPercentage = total ? Math.round((publicCount / total) * 100) : 0;
    if (total === 0) return "No videos available.";
    return `${publicPercentage}% of videos are public, increasing potential audience reach.`;
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
            <p className="text-2xl font-bold text-gray-800">{filteredVideos.length}</p>
          </div>
          <div className="p-6 rounded text-center border border-gray-300 dark:border-gray-700 bg-transparent shadow">
            <h2 className="text-sm text-gray-500">Total Views</h2>
            <p className="text-2xl font-bold text-gray-800">
              {(filteredAnalytics || []).reduce((sum, a) => sum + (a.views || 0), 0)}
            </p>
          </div>
          <div className="p-6 rounded text-center border border-gray-300 dark:border-gray-700 bg-transparent shadow">
            <h2 className="text-sm text-gray-500">Total Likes</h2>
            <p className="text-2xl font-bold text-gray-800">
              {(filteredAnalytics || []).reduce((sum, a) => sum + (a.likes || 0), 0)}
            </p>
          </div>
          <div className="p-6 rounded text-center border border-gray-300 dark:border-gray-700 bg-transparent shadow">
            <h2 className="text-sm text-gray-500">Total Shares</h2>
            <p className="text-2xl font-bold text-gray-800">
              {(filteredAnalytics || []).reduce((sum, a) => sum + (a.shares || 0), 0)}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Video Analytics</h2>
            <button
              onClick={downloadReport}
              className="border border-gray-300 rounded px-2 py-1 text-gray-800 bg-gray-200 hover:bg-gray-300"
            >
              Download Report
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Line Chart: Videos Created Over Time */}
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
                        borderColor: chartColors[0],
                        backgroundColor: "rgba(255, 152, 0, 0.2)",
                        fill: true,
                        tension: 0.3,
                        pointBackgroundColor: chartColors[0],
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: chartColors[0],
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
              <h3 className="text-sm font-semibold mb-2 text-gray-800">Engagement by Video</h3>
              <p className="text-xs text-gray-600 mb-4">Views, likes, and shares for each video.</p>
              <div style={{ height: "250px" }}>
                <Bar
                  data={{
                    labels: engagementStats.labels || [],
                    datasets: [
                      {
                        label: "Views",
                        data: engagementStats.views || [],
                        backgroundColor: chartColors[1],
                        borderColor: chartColors[1],
                        borderWidth: 1,
                      },
                      {
                        label: "Likes",
                        data: engagementStats.likes || [],
                        backgroundColor: chartColors[2],
                        borderColor: chartColors[2],
                        borderWidth: 1,
                      },
                      {
                        label: "Shares",
                        data: engagementStats.shares || [],
                        backgroundColor: chartColors[3],
                        borderColor: chartColors[3],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    scales: {
                      x: { ...chartOptions.scales.x, title: { display: true, text: "Video" } },
                      y: { ...chartOptions.scales.y, title: { display: true, text: "Count" } },
                    },
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-4">{getEngagementInsight()}</p>
            </div>

            {/* Line Chart: Cumulative Views Over Time */}
            <div className="p-4 rounded border border-gray-300 dark:border-gray-700 bg-transparent shadow-sm">
              <h3 className="text-sm font-semibold mb-2 text-gray-800">Cumulative Views Over Time</h3>
              <p className="text-xs text-gray-600 mb-4">Total views accumulated over time.</p>
              <div style={{ height: "250px" }}>
                <Line
                  data={{
                    labels: cumulativeLabels || [],
                    datasets: [
                      {
                        label: "Cumulative Views",
                        data: cumulativeCounts || [],
                        borderColor: chartColors[1],
                        backgroundColor: "rgba(3, 169, 244, 0.2)",
                        fill: true,
                        tension: 0.3,
                        pointBackgroundColor: chartColors[1],
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: chartColors[1],
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    scales: {
                      x: { ...chartOptions.scales.x, title: { display: true, text: "Date" } },
                      y: { ...chartOptions.scales.y, title: { display: true, text: "Views" } },
                    },
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-4">{getCumulativeViewsInsight()}</p>
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
                        backgroundColor: chartColors.slice(0, promptStats.labels.length), // Use enough colors for all prompts
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

            {/* Scatter Chart: Duration vs Engagement */}
            <div className="p-4 rounded border border-gray-300 dark:border-gray-700 bg-transparent shadow-sm">
              <h3 className="text-sm font-semibold mb-2 text-gray-800">Duration vs Likes</h3>
              <p className="text-xs text-gray-600 mb-4">Video duration compared to number of likes.</p>
              <div style={{ height: "250px" }}>
                <Scatter
                  data={{
                    datasets: [
                      {
                        label: "Videos",
                        data: durationVsEngagement || [],
                        backgroundColor: chartColors[0],
                        pointRadius: 6,
                        pointHoverRadius: 8,
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    scales: {
                      x: { ...chartOptions.scales.x, title: { display: true, text: "Duration (seconds)" } },
                      y: { ...chartOptions.scales.y, title: { display: true, text: "Likes" } },
                    },
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-4">{getDurationVsEngagementInsight()}</p>
            </div>

            {/* Doughnut Chart: Visibility Distribution */}
            <div className="p-4 rounded border border-gray-300 dark:border-gray-700 bg-transparent shadow-sm">
              <h3 className="text-sm font-semibold mb-2 text-gray-800">Video Visibility Distribution</h3>
              <p className="text-xs text-gray-600 mb-4">Proportion of public vs. private videos.</p>
              <div style={{ height: "250px" }}>
                <Doughnut
                  data={{
                    labels: visibilityStats.labels || [],
                    datasets: [
                      {
                        data: visibilityStats.counts || [],
                        backgroundColor: [chartColors[1], chartColors[3]], // Blue and Pink for Public/Private
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
              <p className="text-xs text-gray-500 mt-4">{getVisibilityInsight()}</p>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
