import { useData } from '../context/DataContext'
import StatsCard from '../components/StatsCard'

const MODULE_LABELS = {
  barangAnalysis: 'Barang Analysis',
  supplierScorecard: 'Supplier Scorecard',
  barangBaru: 'Barang Baru',
}

function formatDateTime(value) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function formatFileSize(bytes) {
  if (!bytes) return '-'

  const sizeMb = bytes / 1024 / 1024

  return `${sizeMb.toFixed(2)} MB`
}

function Dashboard() {
  const { analyticsData } = useData()

  const barangCount = analyticsData.barangAnalysis?.length || 0
  const supplierCount = analyticsData.supplierScorecard?.length || 0
  const barangBaruCount = analyticsData.barangBaru?.length || 0

  const totalRows = barangCount + supplierCount + barangBaruCount

  const metadata = analyticsData.uploadMetadata || {
    barangAnalysis: null,
    supplierScorecard: null,
    barangBaru: null,
  }

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="page-title mb-0">Dashboard</h1>
        <p className="text-gray-600">
          Ringkasan data analytics dan histori upload terakhir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Data"
          value={totalRows.toLocaleString('id-ID')}
          subtitle="Semua module"
          tone="blue"
        />

        <StatsCard
          title="Barang Analysis"
          value={barangCount.toLocaleString('id-ID')}
          subtitle="Module 1"
          tone="green"
        />

        <StatsCard
          title="Supplier Scorecard"
          value={supplierCount.toLocaleString('id-ID')}
          subtitle="Module 2"
          tone="purple"
        />

        <StatsCard
          title="Barang Baru"
          value={barangBaruCount.toLocaleString('id-ID')}
          subtitle="Module 3"
          tone="orange"
        />
      </div>

      <div className="card mt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Upload Metadata
            </h2>
            <p className="text-sm text-gray-500">
              Informasi file terakhir yang tersimpan di masing-masing module.
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Last update: {formatDateTime(analyticsData.uploadedAt)}
          </div>
        </div>

        <div className="overflow-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                  Module
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                  File Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                  Periode
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 border-b border-gray-200">
                  Row Count
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 border-b border-gray-200">
                  File Size
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                  Upload Date
                </th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(MODULE_LABELS).map(([moduleKey, moduleLabel]) => {
                const item = metadata[moduleKey]

                return (
                  <tr key={moduleKey} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b border-gray-100 font-medium text-gray-800 whitespace-nowrap">
                      {moduleLabel}
                    </td>

                    <td className="px-4 py-3 border-b border-gray-100 text-gray-700 whitespace-nowrap">
                      {item?.filename || (
                        <span className="text-gray-400">Belum upload</span>
                      )}
                    </td>

                    <td className="px-4 py-3 border-b border-gray-100 text-gray-700 whitespace-nowrap">
                      {item?.period || '-'}
                    </td>

                    <td className="px-4 py-3 border-b border-gray-100 text-gray-700 text-right whitespace-nowrap">
                      {item?.rowCount
                        ? item.rowCount.toLocaleString('id-ID')
                        : '0'}
                    </td>

                    <td className="px-4 py-3 border-b border-gray-100 text-gray-700 text-right whitespace-nowrap">
                      {formatFileSize(item?.fileSize)}
                    </td>

                    <td className="px-4 py-3 border-b border-gray-100 text-gray-700 whitespace-nowrap">
                      {formatDateTime(item?.uploadDate)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard