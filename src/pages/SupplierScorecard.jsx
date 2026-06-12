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

function sumByKeys(rows, possibleKeys) {
  return rows.reduce((total, row) => {
    return total + toNumber(getValue(row, possibleKeys))
  }, 0)
}

function SupplierScorecard() {
  const { analyticsData } = useData()

  const rows = analyticsData.supplierScorecard || []

  const totalSku = sumByKeys(rows, ['total_sku', 'sku_count', 'jumlah_sku'])
  const totalSales = sumByKeys(rows, ['total_sales', 'sales', 'omset', 'revenue'])
  const totalOverstock = sumByKeys(rows, ['overstock_count', 'total_overstock'])
  const totalUnderstock = sumByKeys(rows, ['understock_count', 'total_understock'])

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="page-title mb-0">Supplier Scorecard</h1>
        <p className="text-gray-600">
          Analisa performa supplier dari data Module 2.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Total Supplier</div>
          <div className="text-3xl font-bold text-blue-600">
            {rows.length.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-400 mt-2">Baris supplier</div>
        </div>

        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Total SKU</div>
          <div className="text-3xl font-bold text-green-600">
            {totalSku.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-400 mt-2">Akumulasi SKU</div>
        </div>

        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Total Sales</div>
          <div className="text-3xl font-bold text-purple-600">
            {totalSales.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-400 mt-2">Revenue / omset</div>
        </div>

        <div className="card">
          <div className="text-gray-500 text-sm mb-2">Stock Alert</div>
          <div className="text-3xl font-bold text-orange-600">
            {(totalOverstock + totalUnderstock).toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Overstock + understock
          </div>
        </div>
      </div>

      <DataTable
        title="Table Supplier Scorecard"
        description="Search, sort, pagination, dan export data supplier scorecard."
        rows={rows}
        fileName="supplier-scorecard"
        emptyMessage="Belum ada data Supplier Scorecard. Upload file Module 2 terlebih dahulu."
      />
    </div>
  )
}

export default SupplierScorecard