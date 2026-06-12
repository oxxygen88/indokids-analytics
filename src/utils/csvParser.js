import Papa from 'papaparse'
import * as XLSX from 'xlsx'

const MAX_FILE_SIZE_MB = 10

function validateFile(file) {
  if (!file) {
    throw new Error('File belum dipilih.')
  }

  const fileSizeMb = file.size / 1024 / 1024

  if (fileSizeMb > MAX_FILE_SIZE_MB) {
    throw new Error(`Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE_MB}MB.`)
  }

  const fileName = file.name.toLowerCase()
  const isCsv = fileName.endsWith('.csv')
  const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls')

  if (!isCsv && !isExcel) {
    throw new Error('Format file tidak valid. Gunakan CSV, XLSX, atau XLS.')
  }
}

function cleanRows(rows) {
  return rows
    .map((row) => {
      const cleanRow = {}

      Object.keys(row || {}).forEach((key) => {
        const cleanKey = String(key || '').trim()

        if (!cleanKey) return

        const value = row[key]

        cleanRow[cleanKey] =
          value === null || value === undefined ? '' : String(value).trim()
      })

      return cleanRow
    })
    .filter((row) => {
      return Object.values(row).some((value) => String(value).trim() !== '')
    })
}

function parseCsv(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (result) => {
        if (result.errors && result.errors.length > 0) {
          console.warn('CSV parse warnings:', result.errors)
        }

        const rows = cleanRows(result.data || [])
        resolve(rows)
      },
      error: (error) => {
        reject(new Error(error.message || 'Gagal membaca file CSV.'))
      },
    })
  })
}

function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result)
        const workbook = XLSX.read(data, {
          type: 'array',
          cellDates: false,
        })

        const firstSheetName = workbook.SheetNames[0]

        if (!firstSheetName) {
          throw new Error('File Excel tidak memiliki sheet.')
        }

        const worksheet = workbook.Sheets[firstSheetName]

        const rows = XLSX.utils.sheet_to_json(worksheet, {
          defval: '',
          raw: false,
        })

        resolve(cleanRows(rows))
      } catch (error) {
        reject(new Error(error.message || 'Gagal membaca file Excel.'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Gagal membaca file Excel.'))
    }

    reader.readAsArrayBuffer(file)
  })
}

export async function parseUploadFile(file) {
  validateFile(file)

  const fileName = file.name.toLowerCase()

  if (fileName.endsWith('.csv')) {
    return parseCsv(file)
  }

  return parseExcel(file)
}

export function getColumnsFromRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return []
  }

  const columnSet = new Set()

  rows.forEach((row) => {
    Object.keys(row || {}).forEach((key) => columnSet.add(key))
  })

  return Array.from(columnSet)
}