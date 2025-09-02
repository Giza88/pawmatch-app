import React, { useState } from 'react'
import { Heart, Calendar, Pill, Syringe, FileText, Plus, AlertCircle, CheckCircle, Clock, MapPin, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHealth } from '../contexts/HealthContext'
import CreateVaccinationForm from '../components/CreateVaccinationForm'
import CreateMedicationForm from '../components/CreateMedicationForm'
import CreateAppointmentForm from '../components/CreateAppointmentForm'
import CreateHealthRecordForm from '../components/CreateHealthRecordForm'

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
    healthRecords,
    getUpcomingVaccinations,
    getOverdueVaccinations,
    getUpcomingAppointments
  } = useHealth()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'vaccinations' | 'medications' | 'appointments' | 'records'>('overview')
  const [showAddForm, setShowAddForm] = useState(false)
  const [formType, setFormType] = useState<'vaccination' | 'medication' | 'appointment' | 'record'>('vaccination')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Heart },
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

  const getDaysUntil = (dateString: string) => {
    const now = new Date()
    const targetDate = new Date(dateString)
    const diffTime = targetDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Health Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Up to Date</p>
              <p className="text-xl font-bold text-gray-900">{vaccinations.filter(v => !v.isOverdue && !v.isUpcoming).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Due Soon</p>
              <p className="text-xl font-bold text-gray-900">{getUpcomingVaccinations().length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-xl font-bold text-gray-900">{getOverdueVaccinations().length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Pill className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Meds</p>
              <p className="text-xl font-bold text-gray-900">{medications.filter(m => m.isActive).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Vaccinations */}
      {getUpcomingVaccinations().length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Vaccinations Due Soon</h3>
          <div className="space-y-3">
            {getUpcomingVaccinations().map((vaccination) => (
              <div key={vaccination.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <p className="font-medium text-gray-900">{vaccination.name}</p>
                  <p className="text-sm text-gray-600">Due: {formatDate(vaccination.nextDueDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-yellow-800">
                    {getDaysUntil(vaccination.nextDueDate)} days
                  </p>
                  <p className="text-xs text-gray-600">{vaccination.vet}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overdue Vaccinations */}
      {getOverdueVaccinations().length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Overdue Vaccinations</h3>
          <div className="space-y-3">
            {getOverdueVaccinations().map((vaccination) => (
              <div key={vaccination.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-medium text-gray-900">{vaccination.name}</p>
                  <p className="text-sm text-gray-600">Was due: {formatDate(vaccination.nextDueDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-800">
                    {Math.abs(getDaysUntil(vaccination.nextDueDate))} days overdue
                  </p>
                  <p className="text-xs text-gray-600">{vaccination.vet}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Appointments */}
      {getUpcomingAppointments().length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Appointments</h3>
          <div className="space-y-3">
            {getUpcomingAppointments().slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-medium text-gray-900">{appointment.type}</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(appointment.date)} at {formatTime(appointment.time)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-800">
                    {getDaysUntil(appointment.date)} days
                  </p>
                  <p className="text-xs text-gray-600">{appointment.vet}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderVaccinations = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Vaccination History</h3>
        <button
          onClick={() => {
            setFormType('vaccination')
            setShowAddForm(true)
          }}
          className="btn-primary py-2 px-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vaccination
        </button>
      </div>

      <div className="space-y-3">
        {vaccinations.map((vaccination) => (
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
    </div>
  )

  const renderMedications = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
        <button
          onClick={() => {
            setFormType('medication')
            setShowAddForm(true)
          }}
          className="btn-primary py-2 px-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </button>
      </div>

      <div className="space-y-3">
        {medications.map((medication) => (
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
    </div>
  )

  const renderAppointments = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Vet Appointments</h3>
        <button
          onClick={() => {
            setFormType('appointment')
            setShowAddForm(true)
          }}
          className="btn-primary py-2 px-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Appointment
        </button>
      </div>

      <div className="space-y-3">
        {appointments.map((appointment) => (
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
    </div>
  )

  const renderRecords = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Health Records</h3>
        <button
          onClick={() => {
            setFormType('record')
            setShowAddForm(true)
          }}
          className="btn-primary py-2 px-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Record
        </button>
      </div>

      <div className="space-y-3">
        {healthRecords.map((record) => (
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
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'vaccinations':
        return renderVaccinations()
      case 'medications':
        return renderMedications()
      case 'appointments':
        return renderAppointments()
      case 'records':
        return renderRecords()
      default:
        return renderOverview()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-teal-50">
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
          <h2 className="text-2xl font-display font-bold text-earth-900">Health Dashboard</h2>
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
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-300 ${
                    isActive
                      ? 'border-orange-500 text-orange-600 font-body'
                      : 'border-transparent text-earth-500 hover:text-earth-700 hover:border-earth-300 font-body'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

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
