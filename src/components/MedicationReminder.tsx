import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Bell, 
  Calendar,
  Plus,
  X
} from 'lucide-react';
import { useHealth } from '../contexts/HealthContext';

interface HealthReminder {
  id: string;
  type: 'medication' | 'vaccination' | 'appointment' | 'general';
  itemId: string;
  itemName: string;
  description: string;
  time: string;
  isCompleted: boolean;
  date: string;
  notes?: string;
}

const MedicationReminder: React.FC = () => {
  const { medications, vaccinations, appointments, updateMedication } = useHealth();
  const [reminders, setReminders] = useState<HealthReminder[]>([]);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);
  const [newReminder, setNewReminder] = useState({
    type: 'general' as 'medication' | 'vaccination' | 'appointment' | 'general',
    itemId: '',
    time: '',
    notes: ''
  });

  // Generate daily reminders for active medications
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const activeMeds = medications.filter(med => med.isActive);
    
    const todayReminders: MedicationReminder[] = activeMeds.map(med => {
      // Generate reminders based on frequency
      const times = getMedicationTimes(med.frequency);
      return times.map((time, index) => ({
        id: `${med.id}-${today}-${index}`,
        medicationId: med.id,
        medicationName: med.name,
        dosage: med.dosage,
        time: time,
        isCompleted: false,
        date: today,
        notes: med.notes
      }));
    }).flat();

    setReminders(todayReminders);
  }, [medications]);

  const getMedicationTimes = (frequency: string): string[] => {
    switch (frequency.toLowerCase()) {
      case 'once daily':
      case 'daily':
        return ['08:00'];
      case 'twice daily':
      case 'twice a day':
        return ['08:00', '20:00'];
      case 'three times daily':
      case 'three times a day':
        return ['08:00', '14:00', '20:00'];
      case 'every 8 hours':
        return ['08:00', '16:00', '00:00'];
      case 'every 12 hours':
        return ['08:00', '20:00'];
      case 'monthly':
        return ['08:00'];
      default:
        return ['08:00'];
    }
  };

  const markAsCompleted = (reminderId: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, isCompleted: true }
          : reminder
      )
    );
  };

  const editReminder = (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      setNewReminder({
        type: reminder.type,
        itemId: reminder.itemId,
        time: reminder.time,
        notes: reminder.notes || ''
      });
      setShowAddReminder(true);
      // Store the ID of the reminder being edited
      setEditingReminderId(id);
    }
  };

  const deleteReminder = (id: string) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      setReminders(prev => prev.filter(reminder => reminder.id !== id));
    }
  };

  const addCustomReminder = () => {
    if (!newReminder.itemId || !newReminder.time) return;

    const today = new Date().toISOString().split('T')[0];
    let itemName = '';
    let description = '';

    if (newReminder.type === 'medication') {
      const medication = medications.find(med => med.id === newReminder.itemId);
      if (!medication) return;
      itemName = medication.name;
      description = `${medication.dosage} - ${medication.frequency}`;
    } else if (newReminder.type === 'vaccination') {
      const vaccination = vaccinations.find(vacc => vacc.id === newReminder.itemId);
      if (!vaccination) return;
      itemName = vaccination.name;
      description = `Due: ${vaccination.nextDueDate}`;
    } else if (newReminder.type === 'appointment') {
      const appointment = appointments.find(apt => apt.id === newReminder.itemId);
      if (!appointment) return;
      itemName = `${appointment.type} - ${appointment.vet}`;
      description = `${appointment.date} at ${appointment.time}`;
    } else if (newReminder.type === 'general') {
      itemName = newReminder.itemId;
      description = 'Custom reminder';
    }

    const customReminder: HealthReminder = {
      id: `custom-${Date.now()}`,
      type: newReminder.type,
      itemId: newReminder.itemId,
      itemName: itemName,
      description: description,
      time: newReminder.time,
      isCompleted: false,
      date: today,
      notes: newReminder.notes
    };

    if (editingReminderId) {
      // Update existing reminder
      setReminders(prev => 
        prev.map(reminder => 
          reminder.id === editingReminderId ? customReminder : reminder
        )
      );
      setEditingReminderId(null);
    } else {
      // Add new reminder
      setReminders(prev => [...prev, customReminder]);
    }
    
    setNewReminder({ type: 'general', itemId: '', time: '', notes: '' });
    setShowAddReminder(false);
  };

  const getTimeStatus = (time: string) => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);

    const diffMinutes = (reminderTime.getTime() - now.getTime()) / (1000 * 60);
    
    if (diffMinutes < -60) return 'overdue';
    if (diffMinutes < 0) return 'due';
    if (diffMinutes < 30) return 'upcoming';
    return 'scheduled';
  };

  const getStatusColor = (status: string, isCompleted: boolean) => {
    if (isCompleted) return 'bg-green-100 border-green-300 text-green-800';
    
    switch (status) {
      case 'overdue':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'due':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'upcoming':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  const getStatusIcon = (status: string, isCompleted: boolean) => {
    if (isCompleted) return <CheckCircle className="w-4 h-4" />;
    
    switch (status) {
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      case 'due':
        return <Bell className="w-4 h-4" />;
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const completedCount = reminders.filter(r => r.isCompleted).length;
  const totalCount = reminders.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Header with Progress */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-earth-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-display font-bold text-earth-900">Today's Medications</h3>
          <button
            onClick={() => setShowAddReminder(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-full transition-colors"
            title="Add custom reminder"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm font-body mb-1">
              <span className="text-earth-600">Progress</span>
              <span className="text-earth-800 font-semibold">{completedCount}/{totalCount}</span>
            </div>
            <div className="w-full bg-earth-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full"
              />
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display font-bold text-teal-600">{completionRate}%</div>
            <div className="text-xs text-earth-600 font-body">Complete</div>
          </div>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        <AnimatePresence>
          {reminders.map((reminder) => {
            const status = getTimeStatus(reminder.time);
            const statusColor = getStatusColor(status, reminder.isCompleted);
            const statusIcon = getStatusIcon(status, reminder.isCompleted);

            return (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border ${statusColor}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      {reminder.type === 'medication' && <Pill className="w-5 h-5 text-teal-600" />}
                      {reminder.type === 'vaccination' && <Calendar className="w-5 h-5 text-teal-600" />}
                      {reminder.type === 'appointment' && <Clock className="w-5 h-5 text-teal-600" />}
                      {reminder.type === 'general' && <Bell className="w-5 h-5 text-teal-600" />}
                    </div>
                    <div>
                      <h4 className="font-body font-semibold text-earth-900">{reminder.itemName}</h4>
                      <p className="text-sm text-earth-600 font-body">{reminder.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {statusIcon}
                        <span className="text-sm font-body">{formatTime(reminder.time)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => markAsCompleted(reminder.id)}
                      disabled={reminder.isCompleted}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        reminder.isCompleted
                          ? 'bg-green-500 text-white cursor-default'
                          : 'bg-earth-200 hover:bg-teal-500 hover:text-white text-earth-600'
                      }`}
                      title={reminder.isCompleted ? 'Completed' : 'Mark as completed'}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => editReminder(reminder.id)}
                      className="p-2 rounded-full bg-blue-100 hover:bg-blue-500 hover:text-white text-blue-600 transition-all duration-300"
                      title="Edit reminder"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-2 rounded-full bg-red-100 hover:bg-red-500 hover:text-white text-red-600 transition-all duration-300"
                      title="Delete reminder"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {reminder.notes && (
                  <div className="mt-3 pt-3 border-t border-earth-200">
                    <p className="text-sm text-earth-600 font-body">{reminder.notes}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Custom Reminder Modal */}
      <AnimatePresence>
        {showAddReminder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddReminder(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md border border-earth-200 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display font-bold text-earth-900">
                  {editingReminderId ? 'Edit Reminder' : 'Add Custom Reminder'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddReminder(false);
                    setEditingReminderId(null);
                    setNewReminder({ type: 'general', itemId: '', time: '', notes: '' });
                  }}
                  className="p-2 rounded-full hover:bg-earth-100 transition-colors"
                >
                  <X className="w-5 h-5 text-earth-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-body font-medium text-earth-700 mb-2">
                    Reminder Type
                  </label>
                  <select
                    value={newReminder.type}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, type: e.target.value as any, itemId: '' }))}
                    className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white font-body"
                  >
                    <option value="general">General Reminder</option>
                    <option value="medication">Medication</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="appointment">Appointment</option>
                  </select>
                </div>

                {newReminder.type !== 'general' && (
                  <div>
                    <label className="block text-sm font-body font-medium text-earth-700 mb-2">
                      {newReminder.type === 'medication' ? 'Medication' : 
                       newReminder.type === 'vaccination' ? 'Vaccination' : 'Appointment'}
                    </label>
                    <select
                      value={newReminder.itemId}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, itemId: e.target.value }))}
                      className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white font-body"
                    >
                      <option value="">Select {newReminder.type}</option>
                      {newReminder.type === 'medication' && medications.filter(med => med.isActive).map(med => (
                        <option key={med.id} value={med.id}>{med.name}</option>
                      ))}
                      {newReminder.type === 'vaccination' && vaccinations.map(vacc => (
                        <option key={vacc.id} value={vacc.id}>{vacc.name}</option>
                      ))}
                      {newReminder.type === 'appointment' && appointments.filter(apt => !apt.isCompleted).map(apt => (
                        <option key={apt.id} value={apt.id}>{apt.type} - {apt.vet}</option>
                      ))}
                    </select>
                  </div>
                )}

                {newReminder.type === 'general' && (
                  <div>
                    <label className="block text-sm font-body font-medium text-earth-700 mb-2">
                      Reminder Title
                    </label>
                    <input
                      type="text"
                      value={newReminder.itemId}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, itemId: e.target.value }))}
                      placeholder="e.g., Check weight, Grooming, Exercise"
                      className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white font-body"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-body font-medium text-earth-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-medium text-earth-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={newReminder.notes}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any special instructions..."
                    className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white font-body resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowAddReminder(false);
                      setEditingReminderId(null);
                      setNewReminder({ type: 'general', itemId: '', time: '', notes: '' });
                    }}
                    className="flex-1 px-4 py-2 border border-earth-200 text-earth-700 rounded-lg hover:bg-earth-50 transition-colors font-body"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addCustomReminder}
                    className="flex-1 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-body font-semibold"
                  >
                    {editingReminderId ? 'Update Reminder' : 'Add Reminder'}
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

export default MedicationReminder;
