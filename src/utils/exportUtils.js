import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

function normalizeFileName(fileName) {
  const safeName = fileName || 'export-data'

  return safeName
    .toLowerCase()
    .replace(/[^a-z0-9-_]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function getColumns(rows) {
  const columnSet = new Set()

  rows.forEach((row) => {
    Object.keys(row || {}).forEach((key) => {
      columnSet.add(key)
    })
  })

  return Array.from(columnSet)
}

function escapeCsvValue(value) {
  if (value === null || value === undefined) return ''

  const stringValue = String(value)
  const escaped = stringValue.replace(/"/g, '""')

  if (
    escaped.includes(',') ||
    escaped.includes('"') ||
    escaped.includes('\n') ||
    escaped.includes('\r')
  ) {
    return `"${escaped}"`
  }

  return escaped
}

export function exportRowsToCsv(rows, fileName = 'export-data') {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('Tidak ada data untuk diexport.')
  }

  const columns = getColumns(rows)

  const header = columns.map(escapeCsvValue).join(',')

  const body = rows
    .map((row) => {
      return columns
        .map((column) => escapeCsvValue(row[column]))
        .join(',')
    })
    .join('\n')

  const csvContent = `\uFEFF${header}\n${body}`

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  })

  saveAs(blob, `${normalizeFileName(fileName)}.csv`)
}

export function exportRowsToExcel(rows, fileName = 'export-data') {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('Tidak ada data untuk diexport.')
  }

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  })

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  saveAs(blob, `${normalizeFileName(fileName)}.xlsx`)
}