const APP_PREFIX = 'narma_analytics'

export function saveStorage(key, value) {
  try {
    localStorage.setItem(`${APP_PREFIX}_${key}`, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save localStorage:', error)
  }
}

export function loadStorage(key, fallback = null) {
  try {
    const value = localStorage.getItem(`${APP_PREFIX}_${key}`)
    return value ? JSON.parse(value) : fallback
  } catch (error) {
    console.error('Failed to load localStorage:', error)
    return fallback
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(`${APP_PREFIX}_${key}`)
  } catch (error) {
    console.error('Failed to remove localStorage:', error)
  }
}