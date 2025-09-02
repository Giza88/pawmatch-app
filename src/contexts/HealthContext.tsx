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
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([
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
  ])

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Heartgard Plus',
      dosage: '1 chewable',
      frequency: 'Monthly',
      startDate: '2024-01-01',
      isActive: true,
      notes: 'Heartworm prevention'
    },
    {
      id: '2',
      name: 'Frontline Plus',
      dosage: '1 application',
      frequency: 'Monthly',
      startDate: '2024-01-01',
      isActive: true,
      notes: 'Flea and tick prevention'
    }
  ])

  const [appointments, setAppointments] = useState<VetAppointment[]>([
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
  ])

  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
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
  ])

  const addVaccination = (vaccinationData: Omit<Vaccination, 'id'>) => {
    const newVaccination: Vaccination = {
      ...vaccinationData,
      id: Date.now().toString()
    }
    setVaccinations(prev => [newVaccination, ...prev])
  }

  const addMedication = (medicationData: Omit<Medication, 'id'>) => {
    const newMedication: Medication = {
      ...medicationData,
      id: Date.now().toString()
    }
    setMedications(prev => [newMedication, ...prev])
  }

  const addAppointment = (appointmentData: Omit<VetAppointment, 'id'>) => {
    const newAppointment: VetAppointment = {
      ...appointmentData,
      id: Date.now().toString()
    }
    setAppointments(prev => [newAppointment, ...prev])
  }

  const addHealthRecord = (recordData: Omit<HealthRecord, 'id'>) => {
    const newRecord: HealthRecord = {
      ...recordData,
      id: Date.now().toString()
    }
    setHealthRecords(prev => [newRecord, ...prev])
  }

  const updateVaccination = (id: string, updates: Partial<Vaccination>) => {
    setVaccinations(prev => prev.map(vaccination => 
      vaccination.id === id ? { ...vaccination, ...updates } : vaccination
    ))
  }

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications(prev => prev.map(medication => 
      medication.id === id ? { ...medication, ...updates } : medication
    ))
  }

  const updateAppointment = (id: string, updates: Partial<VetAppointment>) => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === id ? { ...appointment, ...updates } : appointment
    ))
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
