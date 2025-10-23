import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity,
  Scale,
  Thermometer,
  Stethoscope,
  Bell,
  Phone,
  MapPin,
  X,
  Plus
} from 'lucide-react';
import { useHealth } from '../contexts/HealthContext';

/**
 * HEALTH DASHBOARD - Comprehensive pet health management interface
 * 
 * This component provides a complete health overview for pets including:
 * - Health metrics and insights
 * - Quick action buttons (reminders, vet calls, emergencies)
 * - Upcoming vaccinations and medications
 * - Appointment scheduling
 * - Health alerts and notifications
 * 
 * Key Features:
 * - Interactive quick action buttons with modals
 * - Health trend analysis and insights
 * - Medication and vaccination tracking
 * - Emergency contact integration
 * - Appointment management
 * - Real-time health status updates
 */

interface HealthMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  icon: React.ComponentType<any>;
}

interface HealthInsight {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  action?: string;
  icon: React.ComponentType<any>;
}

const HealthDashboard: React.FC = () => {
  const { 
    getUpcomingVaccinations, 
    getOverdueVaccinations, 
    getUpcomingAppointments,
    getActiveMedications 
  } = useHealth();

  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showVetModal, setShowVetModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [reminderText, setReminderText] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  // Health metrics - show empty state for new users
  const healthMetrics: HealthMetric[] = [];

  // Health insights - show empty state for new users
  const healthInsights: HealthInsight[] = [];

  const upcomingVaccinations = getUpcomingVaccinations();
  const overdueVaccinations = getOverdueVaccinations();
  const upcomingAppointments = getUpcomingAppointments();
  const activeMedications = getActiveMedications();

  // Quick action handlers
  const handleSetReminder = () => {
    setShowReminderModal(true);
  };

  const handleCallVet = () => {
    setShowVetModal(true);
  };

  const handleFindVet = () => {
    // In a real app, this would open maps or show nearby vets
    alert('Opening vet finder... This would show nearby veterinary clinics.');
  };

  const handleEmergency = () => {
    setShowEmergencyModal(true);
  };

  const handleSaveReminder = () => {
    if (reminderText && reminderDate && reminderTime) {
      // In a real app, this would save to a reminders system
      alert(`Reminder set: "${reminderText}" for ${reminderDate} at ${reminderTime}`);
      setShowReminderModal(false);
      setReminderText('');
      setReminderDate('');
      setReminderTime('');
    }
  };

  const handleCallNumber = (number: string) => {
    // In a real app, this would initiate a phone call
    alert(`Calling ${number}...`);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-orange-200 bg-orange-50 text-orange-800';
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  // Check if user has any health data or if onboarding has been completed
  const hasHealthData = healthMetrics.length > 0 || healthInsights.length > 0 || 
                       upcomingVaccinations.length > 0 || overdueVaccinations.length > 0 || 
                       upcomingAppointments.length > 0 || activeMedications.length > 0;
  
  const onboardingCompleted = localStorage.getItem('healthOnboardingCompleted') === 'true';

  // Show empty state for new users who haven't completed onboarding
  if (!hasHealthData && !onboardingCompleted) {
    return (
      <div className="space-y-6">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-teal-50 to-earth-50 rounded-2xl p-8 shadow-lg border border-earth-200 text-center"
        >
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-teal-600" />
          </div>
          <h3 className="text-2xl font-display font-bold text-earth-900 mb-2">
            Welcome to Health & Wellness!
          </h3>
          <p className="text-earth-600 font-body mb-6 max-w-md mx-auto">
            Start tracking your dog's health journey. Add vaccinations, medications, appointments, and health records to get personalized insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                // Open vaccination form - this will be handled by the parent component
                window.dispatchEvent(new CustomEvent('openVaccinationForm'));
              }}
              className="bg-teal-500 text-white px-6 py-3 rounded-xl font-body font-medium hover:bg-teal-600 transition-colors"
            >
              Add First Vaccination
            </button>
            <button
              onClick={() => {
                // Open appointment form - this will be handled by the parent component
                window.dispatchEvent(new CustomEvent('openAppointmentForm'));
              }}
              className="bg-white text-teal-600 px-6 py-3 rounded-xl font-body font-medium border border-teal-200 hover:bg-teal-50 transition-colors"
            >
              Schedule Appointment
            </button>
            <button
              onClick={() => {
                // Skip onboarding and go to dashboard
                window.dispatchEvent(new CustomEvent('skipHealthOnboarding'));
              }}
              className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-body font-medium border border-gray-200 hover:bg-gray-200 transition-colors"
            >
              Skip for Now
            </button>
          </div>
        </motion.div>

        {/* Quick Setup Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-earth-200"
        >
          <h3 className="text-xl font-display font-bold text-earth-900 mb-4">Get Started</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-earth-50 rounded-xl">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-teal-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-earth-900 mb-1">Add Vaccinations</h4>
                <p className="text-sm text-earth-600">Record your dog's vaccination history</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-earth-50 rounded-xl">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-teal-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-earth-900 mb-1">Schedule Appointments</h4>
                <p className="text-sm text-earth-600">Book upcoming vet visits</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-earth-50 rounded-xl">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-teal-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-earth-900 mb-1">Track Medications</h4>
                <p className="text-sm text-earth-600">Monitor ongoing treatments</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-earth-50 rounded-xl">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-teal-600">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-earth-900 mb-1">Upload Records</h4>
                <p className="text-sm text-earth-600">Store health documents safely</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health Metrics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-earth-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-display font-bold text-earth-900">Health Metrics</h3>
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-sm font-body rounded-full transition-all duration-300 ${
                  selectedPeriod === period
                    ? 'bg-teal-500 text-white'
                    : 'bg-earth-100 text-earth-600 hover:bg-earth-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {healthMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-earth-50 to-teal-50 rounded-xl p-4 border border-earth-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-teal-600" />
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="text-2xl font-display font-bold text-earth-900">
                  {metric.value} <span className="text-sm text-earth-600">{metric.unit}</span>
                </div>
                <div className="text-sm text-earth-600 font-body">{metric.name}</div>
                <div className="text-xs text-earth-500 font-body mt-1">
                  Updated {new Date(metric.lastUpdated).toLocaleDateString()}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Health Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-earth-200"
      >
        <h3 className="text-xl font-display font-bold text-earth-900 mb-4">Health Insights</h3>
        <div className="space-y-3">
          {healthInsights.map((insight) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={insight.id}
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-xl border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-body font-semibold mb-1">{insight.title}</h4>
                    <p className="text-sm font-body mb-2">{insight.description}</p>
                    {insight.action && (
                      <button 
                        onClick={() => {
                          if (insight.action === 'Schedule Now') {
                            // In a real app, this would open the appointment scheduler
                            alert('Opening appointment scheduler... This would help you schedule your vaccination appointment.')
                          } else {
                            alert(`Action: ${insight.action}`)
                          }
                        }}
                        className="text-sm font-body font-medium underline hover:no-underline"
                      >
                        {insight.action}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-earth-200"
      >
        <h3 className="text-xl font-display font-bold text-earth-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            onClick={handleSetReminder}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-xl text-center"
          >
            <Bell className="w-6 h-6 mx-auto mb-2" />
            <div className="font-body font-semibold">Set Reminder</div>
          </motion.button>
          
          <motion.button
            onClick={handleCallVet}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl text-center"
          >
            <Phone className="w-6 h-6 mx-auto mb-2" />
            <div className="font-body font-semibold">Call Vet</div>
          </motion.button>
          
          <motion.button
            onClick={handleFindVet}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl text-center"
          >
            <MapPin className="w-6 h-6 mx-auto mb-2" />
            <div className="font-body font-semibold">Find Vet</div>
          </motion.button>
          
          <motion.button
            onClick={handleEmergency}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl text-center"
          >
            <Stethoscope className="w-6 h-6 mx-auto mb-2" />
            <div className="font-body font-semibold">Emergency</div>
          </motion.button>
        </div>
      </motion.div>

      {/* Upcoming & Overdue Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {/* Overdue Items */}
        {overdueVaccinations.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h4 className="font-display font-bold text-red-900">Overdue Items</h4>
            </div>
            <div className="space-y-2">
              {overdueVaccinations.map((vaccination) => (
                <div key={vaccination.id} className="flex items-center justify-between">
                  <span className="font-body text-red-800">{vaccination.name}</span>
                  <span className="text-sm text-red-600 font-body">
                    {Math.ceil((new Date().getTime() - new Date(vaccination.nextDueDate).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Items */}
        {upcomingVaccinations.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <h4 className="font-display font-bold text-orange-900">Upcoming Vaccinations</h4>
            </div>
            <div className="space-y-2">
              {upcomingVaccinations.map((vaccination) => (
                <div key={vaccination.id} className="flex items-center justify-between">
                  <span className="font-body text-orange-800">{vaccination.name}</span>
                  <span className="text-sm text-orange-600 font-body">
                    Due {new Date(vaccination.nextDueDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Medications */}
        {activeMedications.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <h4 className="font-display font-bold text-blue-900">Active Medications</h4>
            </div>
            <div className="space-y-2">
              {activeMedications.map((medication) => (
                <div key={medication.id} className="flex items-center justify-between">
                  <span className="font-body text-blue-800">{medication.name}</span>
                  <span className="text-sm text-blue-600 font-body">{medication.frequency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {/* Set Reminder Modal */}
        {showReminderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display font-bold text-earth-900">Set Reminder</h3>
                <button
                  onClick={() => setShowReminderModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-body font-medium text-earth-700 mb-2">
                    Reminder Text
                  </label>
                  <input
                    type="text"
                    value={reminderText}
                    onChange={(e) => setReminderText(e.target.value)}
                    placeholder="e.g., Give medication to Max"
                    className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body font-medium text-earth-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-body font-medium text-earth-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowReminderModal(false)}
                    className="flex-1 px-4 py-2 border border-earth-200 text-earth-700 rounded-lg hover:bg-earth-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveReminder}
                    className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    Set Reminder
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Call Vet Modal */}
        {showVetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display font-bold text-earth-900">Call Your Vet</h3>
                <button
                  onClick={() => setShowVetModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <Phone className="w-12 h-12 text-teal-500 mx-auto mb-3" />
                  <p className="text-earth-600 font-body">Choose a contact to call:</p>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handleCallNumber('(555) 123-4567')}
                    className="w-full p-4 border border-earth-200 rounded-lg hover:bg-earth-50 transition-colors text-left"
                  >
                    <div className="font-body font-semibold text-earth-900">Dr. Sarah Johnson</div>
                    <div className="text-sm text-earth-600">Primary Veterinarian</div>
                    <div className="text-sm text-teal-600">(555) 123-4567</div>
                  </button>
                  
                  <button
                    onClick={() => handleCallNumber('(555) 987-6543')}
                    className="w-full p-4 border border-earth-200 rounded-lg hover:bg-earth-50 transition-colors text-left"
                  >
                    <div className="font-body font-semibold text-earth-900">Emergency Vet Clinic</div>
                    <div className="text-sm text-earth-600">24/7 Emergency Service</div>
                    <div className="text-sm text-teal-600">(555) 987-6543</div>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Emergency Modal */}
        {showEmergencyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display font-bold text-red-900">Emergency Contacts</h3>
                <button
                  onClick={() => setShowEmergencyModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <Stethoscope className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <p className="text-earth-600 font-body">Emergency contacts for your pet:</p>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handleCallNumber('911')}
                    className="w-full p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-center"
                  >
                    <div className="font-body font-bold text-lg">Call 911</div>
                    <div className="text-sm">For life-threatening emergencies</div>
                  </button>
                  
                  <button
                    onClick={() => handleCallNumber('(555) 911-PET')}
                    className="w-full p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-left"
                  >
                    <div className="font-body font-semibold text-red-900">Pet Emergency Hotline</div>
                    <div className="text-sm text-red-600">(555) 911-PET</div>
                  </button>
                  
                  <button
                    onClick={() => handleCallNumber('(555) 987-6543')}
                    className="w-full p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-left"
                  >
                    <div className="font-body font-semibold text-red-900">24/7 Emergency Vet</div>
                    <div className="text-sm text-red-600">(555) 987-6543</div>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HealthDashboard;
