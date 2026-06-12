import DataTable from '../components/DataTable'
import { useData } from '../context/DataContext'

function getValue(row, possibleKeys) {
  const normalizedMap = {}

  Object.keys(row || {}).forEach((key) => {
    normalizedMap[key.toLowerCase().replace(/\s+/g, '_')] = row[key]
  })

  for (const key of possibleKeys) {
    const normalizedKey = key.toLowerCase().replace(/\s+/g, '_')

    if (normalizedMap[normalizedKey] !== undefined) {
      return normalizedMap[normalizedKey]
    }
  }

  return ''
}

function countByStatus(rows, keywords) {
  return rows.filter((row) => {
    const status = String(
      getValue(row, [
        'status',
        'stock_status',
        'status_stock',
        'kategori_stock',
        'rekomendasi',
      ]),
    ).toLowerCase()

    return keywords.some((keyword) => status.includes(keyword))
  }).length
}

function BarangAnalysis() {
  const { analyticsData } = useData()

  const rows = analyticsData.barangAnalysis || []

  const overstockCount = countByStatus(rows, ['overstock', 'over stock'])
  const understockCount = countByStatus(rows, ['understock', 'under stock'])
  const normalCount = countByStatus(rows, ['normal'])
  const lossSalesCount = countByStatus(rows, ['loss', 'lost'])

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="page-title mb-0">Barang Analysis</h1>
        <p className="text-gray-600">
          Analisa kondisi stock barang dari data Module 1.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Total Barang</div>
          <div className="text-3xl font-bold text-blue-600">
            {rows.length.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-400 mt-2">Module 1</div>
        </div>

        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Overstock</div>
          <div className="text-3xl font-bold text-red-600">
            {overstockCount.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-400 mt-2">Stock berlebih</div>
        </div>

        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Understock</div>
          <div className="text-3xl font-bold text-yellow-600">
            {understockCount.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-400 mt-2">Stock rendah</div>
        </div>

        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Loss Sales</div>
          <div className="text-3xl font-bold text-orange-600">
            {lossSalesCount.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Normal: {normalCount.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      <DataTable
        title="Table Barang Analysis"
        description="Search, sort, pagination, dan export data barang analysis."
        rows={rows}
        fileName="barang-analysis"
        emptyMessage="Belum ada data Barang Analysis. Upload file Module 1 terlebih dahulu."
      />
    </div>
  )
}

export default BarangAnalysis