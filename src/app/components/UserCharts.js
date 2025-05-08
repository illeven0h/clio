import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function UserCharts({ videos }) {
  const activityData = videos.reduce((acc, video) => {
    const date = new Date(video.createdAt?.seconds * 1000);
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(activityData).map(([label, count]) => ({ label, count }));

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Video Activity</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#FFA500" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
