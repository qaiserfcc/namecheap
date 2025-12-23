export default function AdminDashboard() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2">Total Brands</h3>
            <p className="text-3xl font-bold">2</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2">Total Products</h3>
            <p className="text-3xl font-bold">5</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2">Total Users</h3>
            <p className="text-3xl font-bold">4</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded transition">
                Add New Brand
              </button>
              <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded transition">
                Add New Product
              </button>
              <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded transition">
                Manage Users
              </button>
              <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded transition">
                View Orders
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <p className="text-gray-600">No recent activity</p>
          </div>
        </div>
      </div>
    </main>
  );
}
