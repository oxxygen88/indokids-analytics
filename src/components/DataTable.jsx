import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  FileSpreadsheet,
  Search,
} from 'lucide-react'
import { exportRowsToCsv, exportRowsToExcel } from '../utils/exportUtils'

function getColumnsFromRows(rows) {
  const columnSet = new Set()

  rows.forEach((row) => {
    Object.keys(row || {}).forEach((key) => {
      columnSet.add(key)
    })
  })

  return Array.from(columnSet)
}

function formatCellValue(value) {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  return String(value)
}

function DataTable({
  title = 'Data Table',
  description = '',
  rows = [],
  fileName = 'export-data',
  emptyMessage = 'Belum ada data.',
}) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [exportMessage, setExportMessage] = useState(null)

  const safeRows = Array.isArray(rows) ? rows : []

  const columns = useMemo(() => {
    const keys = getColumnsFromRows(safeRows)

    return keys.map((key) => {
      return {
        accessorKey: key,
        header: key,
        cell: (info) => {
          return (
            <span className="block max-w-[280px] truncate" title={formatCellValue(info.getValue())}>
              {formatCellValue(info.getValue())}
            </span>
          )
        },
      }
    })
  }, [safeRows])

  const table = useReactTable({
    data: safeRows,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const filteredRows = table.getFilteredRowModel().rows.map((row) => row.original)

  function handleExportCsv() {
    try {
      exportRowsToCsv(filteredRows, fileName)
      setExportMessage('Export CSV berhasil.')
    } catch (error) {
      setExportMessage(error.message)
    }
  }

  function handleExportExcel() {
    try {
      exportRowsToExcel(filteredRows, fileName)
      setExportMessage('Export Excel berhasil.')
    } catch (error) {
      setExportMessage(error.message)
    }
  }

  if (safeRows.length === 0) {
    return (
      <div className="card">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>

        <div className="mt-5 border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
          {emptyMessage}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          <p className="text-xs text-gray-400 mt-1">
            Total data: {safeRows.length.toLocaleString('id-ID')} baris · Setelah filter:{' '}
            {filteredRows.length.toLocaleString('id-ID')} baris
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder="Search semua kolom..."
              className="w-full md:w-72 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            <Download size={16} />
            CSV
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            <FileSpreadsheet size={16} />
            Excel
          </button>
        </div>
      </div>

      {exportMessage && (
        <div className="mb-4 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-4 py-3">
          {exportMessage}
        </div>
      )}

      <div className="overflow-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200 whitespace-nowrap"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-2 hover:text-blue-600"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}

                        <span className="text-xs">
                          {{
                            asc: '↑',
                            desc: '↓',
                          }[header.column.getIsSorted()] ?? ''}
                        </span>
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  Data tidak ditemukan.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 border-b border-gray-100 text-gray-700 whitespace-nowrap"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-5">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Rows per page</span>

          <select
            value={table.getState().pagination.pageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            className="border border-gray-300 rounded-lg px-2 py-1"
          >
            {[10, 25, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-2 border border-gray-300 rounded-lg disabled:opacity-40"
          >
            <ChevronsLeft size={16} />
          </button>

          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 border border-gray-300 rounded-lg disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-sm text-gray-600 px-2">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>

          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 border border-gray-300 rounded-lg disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-2 border border-gray-300 rounded-lg disabled:opacity-40"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataTable