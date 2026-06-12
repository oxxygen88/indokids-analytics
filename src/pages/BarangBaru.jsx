import DataTable from '../components/DataTable'
import { useData } from '../context/DataContext'

function toNumber(value) {
  if (value === null || value === undefined || value === '') return 0

  const cleaned = String(value)
    .replace(/\./g, '')
    .replace(/,/g, '.')
    .replace(/[^\d.-]/g, '')

  const parsed = Number(cleaned)

  return Number.isNaN(parsed) ? 0 : parsed
}

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

function countRowsByNumberCondition(rows, keys, condition) {
  return rows.filter((row) => {
    const value = toNumber(getValue(row, keys))
    return condition(value)
  }).length
}

function BarangBaru() {
  const { analyticsData } = useData()

  const rows = analyticsData.barangBaru || []

  const belumJualCount = countRowsByNumberCondition(
    rows,
    ['qty_jual', 'sales_qty', 'total_qty_jual', 'jual'],
    (value) => value <= 0,
  )

  const adaStockCount = countRowsByNumberCondition(
    rows,
    ['stock', 'stock_akhir', 'stok', 'qty_stock'],
    (value) => value > 0,
  )

  const umurLebih30Count = countRowsByNumberCondition(
    rows,
    ['umur_hari', 'age_days', 'days_since_create'],
    (value) => value > 30,
  )

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="page-title mb-0">Barang Baru</h1>
        <p className="text-gray-600">
          Monitoring barang baru dari data Module 3.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Total Barang Baru</div>
          <div className="text-3xl font-bold text-blue-600">
            {rows.length.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-400 mt-2">Module 3</div>
        </div>

        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Belum Jual</div>
          <div className="text-3xl font-bold text-red-600">
            {belumJualCount.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-400 mt-2">Qty jual 0 / kosong</div>
        </div>

        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Ada Stock</div>
          <div className="text-3xl font-bold text-green-600">
            {adaStockCount.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-400 mt-2">Stock tersedia</div>
        </div>

        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Umur &gt; 30 Hari</div>
          <div className="text-3xl font-bold text-orange-600">
            {umurLebih30Count.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-400 mt-2">Perlu perhatian</div>
        </div>
      </div>

      <DataTable
        title="Table Barang Baru"
        description="Search, sort, pagination, dan export data barang baru."
        rows={rows}
        fileName="barang-baru"
        emptyMessage="Belum ada data Barang Baru. Upload file Module 3 terlebih dahulu."
      />
    </div>
  )
}

export default BarangBaru