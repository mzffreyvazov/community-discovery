export default function FilterTabs() {
  return (
    <div className="flex gap-4 mb-6">
      <button className="text-sm font-medium px-4 py-2 rounded-full bg-black text-white">
        All Communities
      </button>
      <button className="text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-100">
        Trending
      </button>
      <button className="text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-100">
        Newly Created
      </button>
      <button className="text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-100">
        Nearby
      </button>
    </div>
  )
} 