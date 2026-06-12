function Dashboard() {
  return (
    <div>
      <h1 className="page-title">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Total Overstock</div>
          <div className="text-3xl font-bold text-red-600">245</div>
          <div className="text-xs text-gray-400 mt-2">18.5% of total</div>
        </div>

        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Normal Stock</div>
          <div className="text-3xl font-bold text-green-600">420</div>
          <div className="text-xs text-gray-400 mt-2">31.8% of total</div>
        </div>

        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Understock</div>
          <div className="text-3xl font-bold text-yellow-600">145</div>
          <div className="text-xs text-gray-400 mt-2">11.0% of total</div>
        </div>

        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Loss Sales</div>
          <div className="text-3xl font-bold text-orange-600">72</div>
          <div className="text-xs text-gray-400 mt-2">5.4% of total</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard