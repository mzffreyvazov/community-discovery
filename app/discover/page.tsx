export default function DiscoveryPage() {
  return (
    <div className="container pt-20">
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Discover Communities</h1>
        
        {/* Search and Filters Section */}
        <div className="mb-8">
          <input 
            type="search"
            placeholder="Search communities..."
            className="w-full max-w-xl px-4 py-2 rounded-full border"
          />
        </div>

        {/* Categories Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Placeholder community cards */}
          {['Music', 'Tech', 'Sports'].map((category) => (
            <div key={category} className="border rounded-lg p-6">
              <h3 className="font-semibold text-xl mb-2">{category}</h3>
              <p className="text-muted-foreground mb-4">
                Connect with fellow {category.toLowerCase()} enthusiasts
              </p>
              <div className="text-sm text-muted-foreground">
                1.2k members • Very Active
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 