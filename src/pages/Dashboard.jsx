import { useData } from '../context/DataContext'

function Dashboard() {
  const { analyticsData } = useData()

  const barangCount = analyticsData.barangAnalysis.length
  const supplierCount = analyticsData.supplierScorecard.length
  const barangBaruCount = analyticsData.barangBaru.length

  const totalRows = barangCount + supplierCount + barangBaruCount

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Total Data</div>
          <div className="text-3xl font-bold text-blue-600">
            {totalRows.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Semua module
          </div>
        </div>

        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Barang Analysis</div>
          <div className="text-3xl font-bold text-green-600">
            {barangCount.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Module 1
          </div>
        </div>

        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Supplier Scorecard</div>
          <div className="text-3xl font-bold text-purple-600">
            {supplierCount.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Module 2
          </div>
        </div>

        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Barang Baru</div>
          <div className="text-3xl font-bold text-orange-600">
            {barangBaruCount.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Module 3
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard