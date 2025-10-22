/**
 * Safe localStorage utilities with error handling
 * Prevents crashes when localStorage is unavailable or quota is exceeded
 */

export interface LocalStorageResult<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Safely get an item from localStorage
 */
export const safeGetItem = <T>(key: string): LocalStorageResult<T> => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { success: false, error: 'localStorage not available' }
    }

    const item = localStorage.getItem(key)
    if (item === null) {
      return { success: true, data: undefined }
    }

    const parsed = JSON.parse(item)
    return { success: true, data: parsed }
  } catch (error) {
    console.error(`Error getting localStorage item "${key}":`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Safely set an item in localStorage
 */
export const safeSetItem = <T>(key: string, value: T): LocalStorageResult<void> => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { success: false, error: 'localStorage not available' }
    }

    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
    return { success: true }
  } catch (error) {
    console.error(`Error setting localStorage item "${key}":`, error)
    
    // Handle quota exceeded error
    if (error instanceof DOMException && error.code === 22) {
      return { 
        success: false, 
        error: 'Storage quota exceeded. Please clear some data and try again.' 
      }
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Safely remove an item from localStorage
 */
export const safeRemoveItem = (key: string): LocalStorageResult<void> => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { success: false, error: 'localStorage not available' }
    }

    localStorage.removeItem(key)
    return { success: true }
  } catch (error) {
    console.error(`Error removing localStorage item "${key}":`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Safely clear all localStorage items
 */
export const safeClear = (): LocalStorageResult<void> => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { success: false, error: 'localStorage not available' }
    }

    localStorage.clear()
    return { success: true }
  } catch (error) {
    console.error('Error clearing localStorage:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false
    }
    
    const testKey = '__localStorage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Get localStorage usage information
 */
export const getStorageInfo = (): { used: number; available: boolean } => {
  try {
    if (!isLocalStorageAvailable()) {
      return { used: 0, available: false }
    }

    let used = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length
      }
    }
    
    return { used, available: true }
  } catch {
    return { used: 0, available: false }
  }
}
