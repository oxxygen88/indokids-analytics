export function toNumber(value) {
  if (value === null || value === undefined || value === '') return 0

  const cleaned = String(value)
    .replace(/\./g, '')
    .replace(/,/g, '.')
    .replace(/[^\d.-]/g, '')

  const parsed = Number(cleaned)

  return Number.isNaN(parsed) ? 0 : parsed
}

export function formatNumber(value) {
  return toNumber(value).toLocaleString('id-ID')
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(toNumber(value))
}

export function formatDate(value) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function normalizeKey(key) {
  return String(key || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
}

export function getValue(row, possibleKeys) {
  const normalizedMap = {}

  Object.keys(row || {}).forEach((key) => {
    normalizedMap[normalizeKey(key)] = row[key]
  })

  for (const key of possibleKeys) {
    const normalizedKey = normalizeKey(key)

    if (normalizedMap[normalizedKey] !== undefined) {
      return normalizedMap[normalizedKey]
    }
  }

  return ''
}

export function getStatusColor(status) {
  const value = String(status || '').toLowerCase()

  if (value.includes('overstock') || value.includes('loss') || value.includes('review') || value.includes('overdue')) {
    return 'bg-red-100 text-red-800 border-red-200'
  }

  if (value.includes('risky') || value.includes('monitor')) {
    return 'bg-orange-100 text-orange-800 border-orange-200'
  }

  if (value.includes('understock') || value.includes('under stock') || value.includes('tier c')) {
    return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }

  if (value.includes('normal') || value.includes('ready') || value.includes('tier a') || value === 'ok') {
    return 'bg-green-100 text-green-800 border-green-200'
  }

  if (value.includes('tier b')) {
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }

  return 'bg-gray-100 text-gray-800 border-gray-200'
}