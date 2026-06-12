import { useRef, useState } from 'react'
import {
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  Trash2,
  UploadCloud,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import { getColumnsFromRows, parseUploadFile } from '../utils/csvParser'

const MODULE_OPTIONS = [
  {
    value: 'barangAnalysis',
    label: 'Barang Analysis',
    description: 'Data hasil query Module 1 untuk analisa stock barang.',
  },
  {
    value: 'supplierScorecard',
    label: 'Supplier Scorecard',
    description: 'Data hasil query Module 2 untuk analisa supplier.',
  },
  {
    value: 'barangBaru',
    label: 'Barang Baru',
    description: 'Data hasil query Module 3 untuk monitoring barang baru.',
  },
]

function formatFileSize(bytes) {
  if (!bytes) return '-'

  const sizeMb = bytes / 1024 / 1024

  return `${sizeMb.toFixed(2)} MB`
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

function Upload() {
  const fileInputRef = useRef(null)

  const {
    analyticsData,
    setModuleData,
    clearModuleData,
    clearAllData,
  } = useData()

  const [selectedModule, setSelectedModule] = useState('barangAnalysis')
  const [period, setPeriod] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewRows, setPreviewRows] = useState([])
  const [columns, setColumns] = useState([])
  const [isParsing, setIsParsing] = useState(false)
  const [message, setMessage] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const selectedModuleInfo = MODULE_OPTIONS.find((item) => {
    return item.value === selectedModule
  })

  async function handleFile(file) {
    setMessage(null)
    setSelectedFile(null)
    setPreviewRows([])
    setColumns([])

    if (!file) return

    try {
      setIsParsing(true)

      const rows = await parseUploadFile(file)
      const detectedColumns = getColumnsFromRows(rows)

      if (rows.length === 0) {
        throw new Error('File berhasil dibaca, tetapi tidak ada data baris.')
      }

      setSelectedFile(file)
      setPreviewRows(rows)
      setColumns(detectedColumns)

      setMessage({
        type: 'success',
        text: `File berhasil dibaca. Total ${rows.length.toLocaleString(
          'id-ID',
        )} baris dan ${detectedColumns.length} kolom.`,
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Gagal membaca file.',
      })
    } finally {
      setIsParsing(false)
    }
  }

  function handleInputChange(event) {
    const file = event.target.files?.[0]
    handleFile(file)
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragOver(false)

    const file = event.dataTransfer.files?.[0]
    handleFile(file)
  }

  function handleDragOver(event) {
    event.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave() {
    setIsDragOver(false)
  }

  function handleSaveData() {
    if (!previewRows.length) {
      setMessage({
        type: 'error',
        text: 'Tidak ada data untuk disimpan.',
      })
      return
    }

    setModuleData(selectedModule, previewRows, {
      filename: selectedFile?.name,
      fileSize: selectedFile?.size,
      period,
    })

    setMessage({
      type: 'success',
      text: `Data berhasil disimpan ke module ${selectedModuleInfo.label}.`,
    })
  }

  function handleResetFile() {
    setSelectedFile(null)
    setPreviewRows([])
    setColumns([])
    setMessage(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function handleModuleChange(event) {
    setSelectedModule(event.target.value)
    handleResetFile()
  }

  function getModuleRowCount(moduleName) {
    return analyticsData?.[moduleName]?.length || 0
  }

  function getModuleMetadata(moduleName) {
    return analyticsData?.uploadMetadata?.[moduleName] || null
  }

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="page-title mb-0">Upload Data</h1>
        <p className="text-gray-600">
          Upload file CSV atau Excel hasil export query analytics dari DBeaver.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="card">
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pilih Module Tujuan
              </label>

              <select
                value={selectedModule}
                onChange={handleModuleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MODULE_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <p className="text-sm text-gray-500 mt-2">
                {selectedModuleInfo?.description}
              </p>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Periode Data
              </label>

              <input
                type="text"
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                placeholder="Contoh: Juni 2026 Week 2, 2026-Q1, JAN Week 1"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <p className="text-sm text-gray-500 mt-2">
                Opsional. Dipakai untuk menandai periode file yang diupload.
              </p>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex justify-center mb-4">
                <UploadCloud size={48} className="text-blue-600" />
              </div>

              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Drag & drop file ke sini
              </h2>

              <p className="text-gray-500 mb-4">
                Format yang didukung: CSV, XLSX, XLS. Maksimal 10MB.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleInputChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isParsing}
              >
                {isParsing ? 'Membaca File...' : 'Pilih File'}
              </button>
            </div>

            {message && (
              <div
                className={`mt-5 flex items-start gap-3 rounded-lg p-4 ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle size={20} className="mt-0.5" />
                ) : (
                  <AlertCircle size={20} className="mt-0.5" />
                )}

                <div className="text-sm">{message.text}</div>
              </div>
            )}

            {selectedFile && (
              <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-lg border border-gray-200 p-4">
                <div className="flex items-start gap-3">
                  <FileSpreadsheet className="text-green-600" size={28} />

                  <div>
                    <div className="font-semibold text-gray-800">
                      {selectedFile.name}
                    </div>

                    <div className="text-sm text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </div>

                    {period && (
                      <div className="text-sm text-gray-500">
                        Periode: {period}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleResetFile}
                    className="btn-secondary"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveData}
                    className="btn-primary"
                  >
                    Simpan Data
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Preview Data
                </h2>

                <p className="text-sm text-gray-500">
                  Menampilkan maksimal 10 baris pertama dari file upload.
                </p>
              </div>

              {previewRows.length > 0 && (
                <div className="text-sm text-gray-600">
                  {previewRows.length.toLocaleString('id-ID')} baris ·{' '}
                  {columns.length} kolom
                </div>
              )}
            </div>

            {previewRows.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                Belum ada data preview. Upload file terlebih dahulu.
              </div>
            ) : (
              <div className="overflow-auto border border-gray-200 rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column}
                          className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200 whitespace-nowrap"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {previewRows.slice(0, 10).map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {columns.map((column) => (
                          <td
                            key={column}
                            className="px-4 py-3 border-b border-gray-100 text-gray-700 whitespace-nowrap"
                          >
                            {row[column] || ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Status Data Tersimpan
            </h2>

            <div className="space-y-3">
              {MODULE_OPTIONS.map((item) => {
                const metadata = getModuleMetadata(item.value)

                return (
                  <div
                    key={item.value}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-gray-800">
                          {item.label}
                        </div>

                        <div className="text-sm text-gray-500">
                          {getModuleRowCount(item.value).toLocaleString(
                            'id-ID',
                          )}{' '}
                          baris
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => clearModuleData(item.value)}
                        className="text-red-600 hover:text-red-800"
                        title="Hapus data module ini"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {metadata && (
                      <div className="mt-3 rounded-lg bg-gray-50 border border-gray-100 p-3 text-xs text-gray-600 space-y-1">
                        <div>
                          <span className="font-semibold">File:</span>{' '}
                          {metadata.filename || '-'}
                        </div>

                        <div>
                          <span className="font-semibold">Periode:</span>{' '}
                          {metadata.period || '-'}
                        </div>

                        <div>
                          <span className="font-semibold">Ukuran:</span>{' '}
                          {formatFileSize(metadata.fileSize)}
                        </div>

                        <div>
                          <span className="font-semibold">Upload:</span>{' '}
                          {formatDateTime(metadata.uploadDate)}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <button
              type="button"
              onClick={clearAllData}
              className="mt-5 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Hapus Semua Data
            </button>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Catatan Upload
            </h2>

            <div className="space-y-3 text-sm text-gray-600">
              <p>
                Pastikan baris pertama file berisi nama kolom.
              </p>

              <p>
                Untuk barcode atau kode barang, format sebaiknya text agar angka
                nol depan tidak hilang.
              </p>

              <p>
                Upload file sesuai module tujuan supaya data analytics tidak
                tertukar.
              </p>

              <p>
                Data dan metadata disimpan di browser menggunakan localStorage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload