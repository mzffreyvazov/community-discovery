export default function CategoryNav() {
  const categories = [
    { icon: '⚡', name: 'Technology' },
    { icon: '🎵', name: 'Music' },
    { icon: '🏃', name: 'Sports' },
    { icon: '🎨', name: 'Arts' },
    { icon: '📚', name: 'Education' },
    { icon: '🍽️', name: 'Food & Drink' },
  ]

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      {categories.map((category) => (
        <button
          key={category.name}
          className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-gray-50"
        >
          <span className="text-2xl mb-2">{category.icon}</span>
          <span className="text-sm">{category.name}</span>
        </button>
      ))}
    </div>
  )
} 