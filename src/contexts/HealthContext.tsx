import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Vaccination, Medication, VetAppointment, HealthRecord } from '../pages/HealthPage'

interface HealthContextType {
  vaccinations: Vaccination[]
  medications: Medication[]
  appointments: VetAppointment[]
  healthRecords: HealthRecord[]
  addVaccination: (vaccination: Omit<Vaccination, 'id'>) => void
  addMedication: (medication: Omit<Medication, 'id'>) => void
  addAppointment: (appointment: Omit<VetAppointment, 'id'>) => void
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => void
  updateVaccination: (id: string, updates: Partial<Vaccination>) => void
  updateMedication: (id: string, updates: Partial<Medication>) => void
  updateAppointment: (id: string, updates: Partial<VetAppointment>) => void
  deleteVaccination: (id: string) => void
  deleteMedication: (id: string) => void
  deleteAppointment: (id: string) => void
  deleteHealthRecord: (id: string) => void
  getUpcomingVaccinations: () => Vaccination[]
  getOverdueVaccinations: () => Vaccination[]
  getUpcomingAppointments: () => VetAppointment[]
  getActiveMedications: () => Medication[]
}

const HealthContext = createContext<HealthContextType | undefined>(undefined)

export const useHealth = () => {
  const context = useContext(HealthContext)
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider')
  }
  return context
}

interface HealthProviderProps {
  children: ReactNode
}

export const HealthProvider: React.FC<HealthProviderProps> = ({ children }) => {
  // Load vaccinations from localStorage or return empty array for new users
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(() => {
    const saved = localStorage.getItem('healthVaccinations')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse vaccinations:', e)
      }
    }
    // Return empty array for new users - no default data
    return []
  })

  // Load medications from localStorage or return empty array for new users
  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('healthMedications')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse medications:', e)
      }
    }
    // Return empty array for new users - no default data
    return []
  })

  // Load appointments from localStorage or return empty array for new users
  const [appointments, setAppointments] = useState<VetAppointment[]>(() => {
    const saved = localStorage.getItem('healthAppointments')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse appointments:', e)
      }
    }
    // Return empty array for new users - no default data
    return []
  })

  // Load health records from localStorage or return empty array for new users
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(() => {
    const saved = localStorage.getItem('healthRecords')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse health records:', e)
      }
    }
    // Return empty array for new users - no default data
    return []
  })

  const addVaccination = (vaccinationData: Omit<Vaccination, 'id'>) => {
    const newVaccination: Vaccination = {
      ...vaccinationData,
      id: Date.now().toString()
    }
    setVaccinations(prev => {
      const updated = [newVaccination, ...prev]
      localStorage.setItem('healthVaccinations', JSON.stringify(updated))
      return updated
    })
  }

  const addMedication = (medicationData: Omit<Medication, 'id'>) => {
    const newMedication: Medication = {
      ...medicationData,
      id: Date.now().toString()
    }
    setMedications(prev => {
      const updated = [newMedication, ...prev]
      localStorage.setItem('healthMedications', JSON.stringify(updated))
      return updated
    })
  }

  const addAppointment = (appointmentData: Omit<VetAppointment, 'id'>) => {
    const newAppointment: VetAppointment = {
      ...appointmentData,
      id: Date.now().toString()
    }
    setAppointments(prev => {
      const updated = [newAppointment, ...prev]
      localStorage.setItem('healthAppointments', JSON.stringify(updated))
      return updated
    })
  }

  const addHealthRecord = (recordData: Omit<HealthRecord, 'id'>) => {
    const newRecord: HealthRecord = {
      ...recordData,
      id: Date.now().toString()
    }
    setHealthRecords(prev => {
      const updated = [newRecord, ...prev]
      localStorage.setItem('healthRecords', JSON.stringify(updated))
      return updated
    })
  }

  const updateVaccination = (id: string, updates: Partial<Vaccination>) => {
    setVaccinations(prev => {
      const updated = prev.map(vaccination => 
        vaccination.id === id ? { ...vaccination, ...updates } : vaccination
      )
      localStorage.setItem('healthVaccinations', JSON.stringify(updated))
      return updated
    })
  }

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications(prev => {
      const updated = prev.map(medication => 
        medication.id === id ? { ...medication, ...updates } : medication
      )
      localStorage.setItem('healthMedications', JSON.stringify(updated))
      return updated
    })
  }

  const updateAppointment = (id: string, updates: Partial<VetAppointment>) => {
    setAppointments(prev => {
      const updated = prev.map(appointment => 
        appointment.id === id ? { ...appointment, ...updates } : appointment
      )
      localStorage.setItem('healthAppointments', JSON.stringify(updated))
      return updated
    })
  }

  const deleteVaccination = (id: string) => {
    setVaccinations(prev => {
      const updated = prev.filter(vaccination => vaccination.id !== id)
      localStorage.setItem('healthVaccinations', JSON.stringify(updated))
      return updated
    })
  }

  const deleteMedication = (id: string) => {
    setMedications(prev => {
      const updated = prev.filter(medication => medication.id !== id)
      localStorage.setItem('healthMedications', JSON.stringify(updated))
      return updated
    })
  }

  const deleteAppointment = (id: string) => {
    setAppointments(prev => {
      const updated = prev.filter(appointment => appointment.id !== id)
      localStorage.setItem('healthAppointments', JSON.stringify(updated))
      return updated
    })
  }

  const deleteHealthRecord = (id: string) => {
    setHealthRecords(prev => {
      const updated = prev.filter(record => record.id !== id)
      localStorage.setItem('healthRecords', JSON.stringify(updated))
      return updated
    })
  }

  const getUpcomingVaccinations = () => {
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    return vaccinations.filter(vaccination => {
      const dueDate = new Date(vaccination.nextDueDate)
      return dueDate <= thirtyDaysFromNow && !vaccination.isOverdue
    })
  }

  const getOverdueVaccinations = () => {
    const now = new Date()
    return vaccinations.filter(vaccination => {
      const dueDate = new Date(vaccination.nextDueDate)
      return dueDate < now
    })
  }

  const getUpcomingAppointments = () => {
    const now = new Date()
    return appointments
      .filter(appointment => !appointment.isCompleted)
      .filter(appointment => {
        const appointmentDate = new Date(`${appointment.date} ${appointment.time}`)
        return appointmentDate > now
      })
      .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())
  }

  const getActiveMedications = () => {
    return medications.filter(medication => medication.isActive)
  }

  const value: HealthContextType = {
    vaccinations,
    medications,
    appointments,
    healthRecords,
    addVaccination,
    addMedication,
    addAppointment,
    addHealthRecord,
    updateVaccination,
    updateMedication,
    updateAppointment,
    deleteVaccination,
    deleteMedication,
    deleteAppointment,
    deleteHealthRecord,
    getUpcomingVaccinations,
    getOverdueVaccinations,
    getUpcomingAppointments,
    getActiveMedications
  }

  return (
    <HealthContext.Provider value={value}>
      {children}
    </HealthContext.Provider>
  )
}
