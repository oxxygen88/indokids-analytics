import { createContext, useContext, useMemo, useState } from 'react'
import { loadStorage, saveStorage, removeStorage } from '../utils/localStorage'

const DataContext = createContext(null)

const DEFAULT_DATA = {
  barangAnalysis: [],
  supplierScorecard: [],
  barangBaru: [],
  uploadedAt: null,
}

export function DataProvider({ children }) {
  const [analyticsData, setAnalyticsData] = useState(() => {
    return loadStorage('analytics_data', DEFAULT_DATA)
  })

  function setModuleData(moduleName, rows) {
    const updatedData = {
      ...analyticsData,
      [moduleName]: rows,
      uploadedAt: new Date().toISOString(),
    }

    setAnalyticsData(updatedData)
    saveStorage('analytics_data', updatedData)
  }

  function clearModuleData(moduleName) {
    const updatedData = {
      ...analyticsData,
      [moduleName]: [],
      uploadedAt: new Date().toISOString(),
    }

    setAnalyticsData(updatedData)
    saveStorage('analytics_data', updatedData)
  }

  function clearAllData() {
    setAnalyticsData(DEFAULT_DATA)
    removeStorage('analytics_data')
  }

  const value = useMemo(() => {
    return {
      analyticsData,
      setModuleData,
      clearModuleData,
      clearAllData,
      hasBarangData: analyticsData.barangAnalysis.length > 0,
      hasSupplierData: analyticsData.supplierScorecard.length > 0,
      hasBarangBaruData: analyticsData.barangBaru.length > 0,
    }
  }, [analyticsData])

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)

  if (!context) {
    throw new Error('useData must be used inside DataProvider')
  }

  return context
}