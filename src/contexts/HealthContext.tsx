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
  // Load vaccinations from localStorage or use defaults
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(() => {
    const saved = localStorage.getItem('healthVaccinations')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse vaccinations:', e)
      }
    }
    return [
    {
      id: '1',
      name: 'Rabies',
      dateGiven: '2024-01-15',
      nextDueDate: '2025-01-15',
      isOverdue: false,
      isUpcoming: false,
      vet: 'Dr. Sarah Johnson',
      notes: 'Annual booster'
    },
    {
      id: '2',
      name: 'DHPP (Distemper)',
      dateGiven: '2024-01-15',
      nextDueDate: '2025-01-15',
      isOverdue: false,
      isUpcoming: false,
      vet: 'Dr. Sarah Johnson',
      notes: 'Annual booster'
    },
    {
      id: '3',
      name: 'Bordetella',
      dateGiven: '2024-01-15',
      nextDueDate: '2024-07-15',
      isOverdue: false,
      isUpcoming: true,
      vet: 'Dr. Sarah Johnson',
      notes: '6-month booster'
    }
  ]
  })

  // Load medications from localStorage or use defaults
  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('healthMedications')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse medications:', e)
      }
    }
    return [
    {
      id: '1',
      name: 'Heartgard Plus',
      dosage: '1 chewable',
      frequency: 'Monthly',
      startDate: '2024-01-01',
      isActive: true,
      notes: 'Heartworm prevention - currently active'
    },
    {
      id: '2',
      name: 'Frontline Plus',
      dosage: '1 application',
      frequency: 'Monthly',
      startDate: '2024-01-01',
      isActive: true,
      notes: 'Flea and tick prevention - currently active'
    },
    {
      id: '3',
      name: 'Rimadyl',
      dosage: '100mg tablet',
      frequency: 'Twice daily',
      startDate: '2024-01-10',
      isActive: false,
      notes: 'Pain medication for arthritis - completed 2-week course'
    },
    {
      id: '4',
      name: 'Amoxicillin',
      dosage: '250mg capsule',
      frequency: 'Twice daily',
      startDate: '2024-01-05',
      isActive: false,
      notes: 'Antibiotic for skin infection - completed 10-day course'
    },
    {
      id: '5',
      name: 'Metronidazole',
      dosage: '250mg tablet',
      frequency: 'Twice daily',
      startDate: '2024-01-20',
      isActive: false,
      notes: 'Antibiotic for digestive issues - completed 7-day course'
    }
  ]
  })

  // Load appointments from localStorage or use defaults
  const [appointments, setAppointments] = useState<VetAppointment[]>(() => {
    const saved = localStorage.getItem('healthAppointments')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse appointments:', e)
      }
    }
    return [
    {
      id: '1',
      type: 'Checkup',
      date: '2024-02-15',
      time: '10:00',
      vet: 'Dr. Sarah Johnson',
      location: 'Central Vet Clinic',
      phone: '(555) 123-4567',
      notes: 'Annual wellness exam',
      isCompleted: false
    },
    {
      id: '2',
      type: 'Vaccination',
      date: '2024-07-15',
      time: '14:30',
      vet: 'Dr. Sarah Johnson',
      location: 'Central Vet Clinic',
      phone: '(555) 123-4567',
      notes: 'Bordetella booster',
      isCompleted: false
    }
  ]
  })

  // Load health records from localStorage or use defaults
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(() => {
    const saved = localStorage.getItem('healthRecords')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse health records:', e)
      }
    }
    return [
    {
      id: '1',
      title: 'Rabies Certificate',
      type: 'Vaccination',
      date: '2024-01-15',
      vet: 'Dr. Sarah Johnson',
      notes: 'Annual rabies vaccination certificate'
    },
    {
      id: '2',
      title: 'Blood Test Results',
      type: 'Test Results',
      date: '2024-01-15',
      vet: 'Dr. Sarah Johnson',
      notes: 'Annual wellness blood work - all normal'
    }
  ]
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
