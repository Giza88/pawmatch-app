import React, { useState, useEffect } from 'react'
import { Heart, Calendar, Pill, Syringe, FileText, Plus, MapPin, Phone, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHealth } from '../contexts/HealthContext'
import CreateVaccinationForm from '../components/CreateVaccinationForm'
import CreateMedicationForm from '../components/CreateMedicationForm'
import CreateAppointmentForm from '../components/CreateAppointmentForm'
import CreateHealthRecordForm from '../components/CreateHealthRecordForm'
import LoadingScreen from '../components/LoadingScreen'
import HealthDashboard from '../components/HealthDashboard'
import MedicationReminder from '../components/MedicationReminder'
import EmergencyContacts from '../components/EmergencyContacts'
import Logo from '../components/Logo'
import { sendHealthAlert } from '../utils/notifications'

export interface Vaccination {
  id: string
  name: string
  dateGiven: string
  nextDueDate: string
  isOverdue: boolean
  isUpcoming: boolean
  vet: string
  notes?: string
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  isActive: boolean
  notes?: string
  lastGiven?: string
}

export interface VetAppointment {
  id: string
  type: 'Checkup' | 'Vaccination' | 'Surgery' | 'Emergency' | 'Follow-up' | 'Other'
  date: string
  time: string
  vet: string
  location: string
  phone: string
  notes?: string
  isCompleted: boolean
}

export interface HealthRecord {
  id: string
  title: string
  type: 'Vaccination' | 'Test Results' | 'Prescription' | 'Surgery Report' | 'Other'
  date: string
  vet: string
  fileUrl?: string
  notes?: string
}

const HealthPage: React.FC = () => {
  const { 
    vaccinations, 
    medications, 
    appointments, 
    healthRecords
  } = useHealth()
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reminders' | 'contacts' | 'vaccinations' | 'medications' | 'appointments' | 'records'>('dashboard')
  const [showAddForm, setShowAddForm] = useState(false)
  const [formType, setFormType] = useState<'vaccination' | 'medication' | 'appointment' | 'record'>('vaccination')
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Check for health alerts on component load
  useEffect(() => {
    const checkHealthAlerts = () => {
      // Check for overdue vaccinations
      vaccinations.forEach(vaccination => {
        if (vaccination.isOverdue) {
          sendHealthAlert('vaccination', vaccination.name, 'high')
        } else if (vaccination.isUpcoming) {
          sendHealthAlert('vaccination', vaccination.name, 'medium')
        }
      })

      // Check for medication reminders (example: if medication is active and needs attention)
      medications.forEach(medication => {
        if (medication.isActive) {
          // In a real app, you'd check if it's time for the next dose
          // For demo purposes, we'll just send a general reminder
          const today = new Date()
          const lastGiven = medication.lastGiven ? new Date(medication.lastGiven) : new Date(medication.startDate)
          const daysSinceLastGiven = Math.floor((today.getTime() - lastGiven.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysSinceLastGiven >= 1) { // Example: remind if it's been a day
            sendHealthAlert('medication', medication.name, 'medium')
          }
        }
      })

      // Check for upcoming appointments
      appointments.forEach(appointment => {
        if (!appointment.isCompleted) {
          const appointmentDate = new Date(appointment.date)
          const today = new Date()
          const daysUntilAppointment = Math.floor((appointmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysUntilAppointment <= 1 && daysUntilAppointment >= 0) {
            sendHealthAlert('appointment', `${appointment.type} with ${appointment.vet}`, 'medium')
          }
        }
      })
    }

    // Check alerts after loading is complete
    if (!isLoading) {
      setTimeout(checkHealthAlerts, 2000) // Wait 2 seconds after loading
    }
  }, [isLoading, vaccinations, medications, appointments])

  // Handle custom events from HealthDashboard
  useEffect(() => {
    const handleOpenVaccinationForm = () => {
      setFormType('vaccination')
      setShowAddForm(true)
    }

    const handleOpenAppointmentForm = () => {
      setFormType('appointment')
      setShowAddForm(true)
    }

    const handleSkipHealthOnboarding = () => {
      // Mark onboarding as completed and show dashboard
      localStorage.setItem('healthOnboardingCompleted', 'true')
      // Force re-render to show dashboard
      window.location.reload()
    }

    // Add event listeners
    window.addEventListener('openVaccinationForm', handleOpenVaccinationForm)
    window.addEventListener('openAppointmentForm', handleOpenAppointmentForm)
    window.addEventListener('skipHealthOnboarding', handleSkipHealthOnboarding)

    // Cleanup
    return () => {
      window.removeEventListener('openVaccinationForm', handleOpenVaccinationForm)
      window.removeEventListener('openAppointmentForm', handleOpenAppointmentForm)
      window.removeEventListener('skipHealthOnboarding', handleSkipHealthOnboarding)
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen message="Loading health records..." />
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Heart },
    { id: 'reminders', label: 'Reminders', icon: Pill },
    { id: 'contacts', label: 'Emergency', icon: Phone },
    { id: 'vaccinations', label: 'Vaccinations', icon: Syringe },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'records', label: 'Records', icon: FileText }
  ]

  const closeForm = () => {
    setShowAddForm(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const renderVaccinations = () => {
    const filteredVaccinations = vaccinations.filter(vaccination => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()
      return (
        vaccination.name.toLowerCase().includes(searchLower) ||
        vaccination.vet.toLowerCase().includes(searchLower) ||
        (vaccination.notes && vaccination.notes.toLowerCase().includes(searchLower))
      )
    })

    return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Vaccination History</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setFormType('vaccination')
            setShowAddForm(true)
          }}
          className="btn-primary btn-icon-left"
        >
          <Plus className="w-5 h-5" />
          Add Vaccination
        </motion.button>
      </div>

      {filteredVaccinations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No vaccinations found{searchTerm && ' matching your search'}.</p>
        </div>
      ) : (
      <div className="space-y-3">
        {filteredVaccinations.map((vaccination) => (
          <motion.div
            key={vaccination.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{vaccination.name}</h4>
                <p className="text-sm text-gray-600">Given: {formatDate(vaccination.dateGiven)}</p>
                <p className="text-sm text-gray-600">Next due: {formatDate(vaccination.nextDueDate)}</p>
                <p className="text-sm text-gray-600">Vet: {vaccination.vet}</p>
                {vaccination.notes && (
                  <p className="text-sm text-gray-600 mt-2">{vaccination.notes}</p>
                )}
              </div>
              <div className="text-right">
                {vaccination.isOverdue ? (
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                    Overdue
                  </span>
                ) : vaccination.isUpcoming ? (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    Due Soon
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Up to Date
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      )}
    </div>
    )
  }

  const renderMedications = () => {
    const filteredMedications = medications.filter(medication => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()
      return (
        medication.name.toLowerCase().includes(searchLower) ||
        medication.dosage.toLowerCase().includes(searchLower) ||
        medication.frequency.toLowerCase().includes(searchLower) ||
        (medication.notes && medication.notes.toLowerCase().includes(searchLower))
      )
    })

    return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setFormType('medication')
            setShowAddForm(true)
          }}
          className="btn-primary btn-icon-left"
        >
          <Plus className="w-5 h-5" />
          Add Medication
        </motion.button>
      </div>

      {filteredMedications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No medications found{searchTerm && ' matching your search'}.</p>
        </div>
      ) : (
      <div className="space-y-3">
        {filteredMedications.map((medication) => (
          <motion.div
            key={medication.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{medication.name}</h4>
                <p className="text-sm text-gray-600">{medication.dosage} - {medication.frequency}</p>
                <p className="text-sm text-gray-600">Started: {formatDate(medication.startDate)}</p>
                {medication.endDate && (
                  <p className="text-sm text-gray-600">Ends: {formatDate(medication.endDate)}</p>
                )}
                {medication.notes && (
                  <p className="text-sm text-gray-600 mt-2">{medication.notes}</p>
                )}
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  medication.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {medication.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      )}
    </div>
    )
  }

  const renderAppointments = () => {
    const filteredAppointments = appointments.filter(appointment => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()
      return (
        appointment.type.toLowerCase().includes(searchLower) ||
        appointment.vet.toLowerCase().includes(searchLower) ||
        appointment.location.toLowerCase().includes(searchLower) ||
        (appointment.notes && appointment.notes.toLowerCase().includes(searchLower))
      )
    })

    return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Vet Appointments</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setFormType('appointment')
            setShowAddForm(true)
          }}
          className="btn-primary btn-icon-left"
        >
          <Plus className="w-5 h-5" />
          Schedule Appointment
        </motion.button>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No appointments found{searchTerm && ' matching your search'}.</p>
        </div>
      ) : (
      <div className="space-y-3">
        {filteredAppointments.map((appointment) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{appointment.type}</h4>
                <p className="text-sm text-gray-600">
                  {formatDate(appointment.date)} at {formatTime(appointment.time)}
                </p>
                <p className="text-sm text-gray-600">Vet: {appointment.vet}</p>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{appointment.location}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{appointment.phone}</span>
                </div>
                {appointment.notes && (
                  <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
                )}
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  appointment.isCompleted 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {appointment.isCompleted ? 'Completed' : 'Scheduled'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      )}
    </div>
    )
  }

  const renderRecords = () => {
    const filteredHealthRecords = healthRecords.filter(record => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()
      return (
        record.title.toLowerCase().includes(searchLower) ||
        record.type.toLowerCase().includes(searchLower) ||
        record.vet.toLowerCase().includes(searchLower) ||
        (record.notes && record.notes.toLowerCase().includes(searchLower))
      )
    })

    return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Health Records</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setFormType('record')
            setShowAddForm(true)
          }}
          className="btn-primary btn-icon-left"
        >
          <Plus className="w-5 h-5" />
          Add Record
        </motion.button>
      </div>

      {filteredHealthRecords.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No health records found{searchTerm && ' matching your search'}.</p>
        </div>
      ) : (
      <div className="space-y-3">
        {filteredHealthRecords.map((record) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{record.title}</h4>
                <p className="text-sm text-gray-600">Type: {record.type}</p>
                <p className="text-sm text-gray-600">Date: {formatDate(record.date)}</p>
                <p className="text-sm text-gray-600">Vet: {record.vet}</p>
                {record.notes && (
                  <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                )}
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {record.type}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      )}
    </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <HealthDashboard />
      case 'reminders':
        return <MedicationReminder />
      case 'contacts':
        return <EmergencyContacts />
      case 'vaccinations':
        return renderVaccinations()
      case 'medications':
        return renderMedications()
      case 'appointments':
        return renderAppointments()
      case 'records':
        return renderRecords()
      default:
        return <HealthDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-teal-50 pb-32">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-teal-500 py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 via-orange-800/70 to-teal-600/60" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-script font-bold text-white mb-4">
            Health & Wellness
          </h1>
          <p className="text-xl text-white/90 font-body max-w-2xl mx-auto">
            Keep track of your dog's health journey with comprehensive records and reminders
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-earth-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <Logo size="md" showText={false} />
            <h2 className="text-2xl font-display font-bold text-earth-900 ml-3">Health Dashboard</h2>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-earth-200">
        <div className="max-w-md mx-auto">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveTab(tab.id as any)
                    setSearchTerm('') // Clear search when changing tabs
                  }}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-3 transition-all duration-300 rounded-t-xl ${
                    isActive
                      ? 'border-orange-500 text-orange-600 bg-orange-50 shadow-lg font-body'
                      : 'border-transparent text-earth-500 hover:text-earth-700 hover:border-earth-300 hover:bg-earth-50 font-body'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-orange-600' : 'text-earth-500'}`} />
                  {tab.label}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Search Bar - only for data tabs */}
      {['vaccinations', 'medications', 'appointments', 'records'].includes(activeTab) && (
        <div className="max-w-md mx-auto px-4 pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 font-body"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {renderContent()}
      </div>

      {/* Add Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <>
            {formType === 'vaccination' && <CreateVaccinationForm isOpen={showAddForm} onClose={closeForm} />}
            {formType === 'medication' && <CreateMedicationForm isOpen={showAddForm} onClose={closeForm} />}
            {formType === 'appointment' && <CreateAppointmentForm isOpen={showAddForm} onClose={closeForm} />}
            {formType === 'record' && <CreateHealthRecordForm isOpen={showAddForm} onClose={closeForm} />}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HealthPage
