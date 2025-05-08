export default function UserStats({ videos, likes }) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow text-center">
          <h3 className="text-sm text-gray-500">Videos Created</h3>
          <p className="text-xl font-bold">{videos.length}</p>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <h3 className="text-sm text-gray-500">Likes Given</h3>
          <p className="text-xl font-bold">{likes.length}</p>
        </div>
        {/* Add more cards like Prompt Word Count, Last Activity, etc. */}
      </div>
    );
  }
  