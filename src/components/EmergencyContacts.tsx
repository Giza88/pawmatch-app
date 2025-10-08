import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Star, 
  Plus, 
  Edit3, 
  Trash2,
  Heart,
  Stethoscope,
  AlertTriangle
} from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  type: 'vet' | 'emergency' | 'specialist' | 'groomer' | 'other';
  phone: string;
  address?: string;
  hours?: string;
  notes?: string;
  isFavorite: boolean;
  distance?: string;
}

const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Central Vet Clinic',
      type: 'vet',
      phone: '(555) 123-4567',
      address: '123 Main St, New York, NY 10001',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
      notes: 'Primary veterinarian - Dr. Sarah Johnson',
      isFavorite: true,
      distance: '0.8 miles'
    },
    {
      id: '2',
      name: '24/7 Emergency Animal Hospital',
      type: 'emergency',
      phone: '(555) 911-PETS',
      address: '456 Emergency Ave, New York, NY 10002',
      hours: '24/7 Emergency Services',
      notes: 'Emergency and critical care',
      isFavorite: true,
      distance: '2.1 miles'
    },
    {
      id: '3',
      name: 'Pet Grooming Plus',
      type: 'groomer',
      phone: '(555) 987-6543',
      address: '789 Grooming Blvd, New York, NY 10003',
      hours: 'Tue-Sat: 9AM-5PM',
      notes: 'Full-service grooming and spa',
      isFavorite: false,
      distance: '1.5 miles'
    },
    {
      id: '4',
      name: 'Dr. Michael Chen - Cardiologist',
      type: 'specialist',
      phone: '(555) 456-7890',
      address: '321 Specialist St, New York, NY 10004',
      hours: 'Mon-Thu: 9AM-5PM',
      notes: 'Cardiology specialist - by referral only',
      isFavorite: false,
      distance: '3.2 miles'
    }
  ]);

  const [showAddContact, setShowAddContact] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({
    name: '',
    type: 'vet',
    phone: '',
    address: '',
    hours: '',
    notes: '',
    isFavorite: false
  });

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'vet':
        return <Stethoscope className="w-5 h-5" />;
      case 'emergency':
        return <AlertTriangle className="w-5 h-5" />;
      case 'specialist':
        return <Heart className="w-5 h-5" />;
      case 'groomer':
        return <Star className="w-5 h-5" />;
      default:
        return <Phone className="w-5 h-5" />;
    }
  };

  const getContactColor = (type: string) => {
    switch (type) {
      case 'vet':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'emergency':
        return 'bg-red-100 text-red-600 border-red-200';
      case 'specialist':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'groomer':
        return 'bg-pink-100 text-pink-600 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vet':
        return 'Veterinarian';
      case 'emergency':
        return 'Emergency';
      case 'specialist':
        return 'Specialist';
      case 'groomer':
        return 'Groomer';
      default:
        return 'Other';
    }
  };

  const handleCall = (phone: string) => {
    // In a real app, this would initiate a phone call
    window.open(`tel:${phone}`, '_self');
  };

  const handleGetDirections = (address: string) => {
    // In a real app, this would open maps
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  const toggleFavorite = (id: string) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === id 
          ? { ...contact, isFavorite: !contact.isFavorite }
          : contact
      )
    );
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContact.name!,
      type: newContact.type as any,
      phone: newContact.phone!,
      address: newContact.address,
      hours: newContact.hours,
      notes: newContact.notes,
      isFavorite: newContact.isFavorite || false
    };

    setContacts(prev => [...prev, contact]);
    setNewContact({
      name: '',
      type: 'vet',
      phone: '',
      address: '',
      hours: '',
      notes: '',
      isFavorite: false
    });
    setShowAddContact(false);
  };

  const updateContact = () => {
    if (!editingContact || !newContact.name || !newContact.phone) return;

    setContacts(prev => 
      prev.map(contact => 
        contact.id === editingContact.id 
          ? { ...contact, ...newContact }
          : contact
      )
    );
    setEditingContact(null);
    setNewContact({
      name: '',
      type: 'vet',
      phone: '',
      address: '',
      hours: '',
      notes: '',
      isFavorite: false
    });
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const startEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setNewContact(contact);
    setShowAddContact(true);
  };

  const favorites = contacts.filter(contact => contact.isFavorite);
  const regularContacts = contacts.filter(contact => !contact.isFavorite);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-bold text-earth-900">Emergency Contacts</h3>
        <button
          onClick={() => setShowAddContact(true)}
          className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-full transition-colors"
          title="Add new contact"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div>
          <h4 className="text-lg font-display font-semibold text-earth-800 mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Favorites
          </h4>
          <div className="space-y-3">
            {favorites.map((contact) => (
              <motion.div
                key={contact.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-earth-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${getContactColor(contact.type)}`}>
                      {getContactIcon(contact.type)}
                    </div>
                    <div>
                      <h5 className="font-body font-bold text-earth-900">{contact.name}</h5>
                      <p className="text-sm text-earth-600 font-body">{getTypeLabel(contact.type)}</p>
                      {contact.distance && (
                        <p className="text-xs text-earth-500 font-body">{contact.distance}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(contact.id)}
                      className="p-1 rounded-full hover:bg-yellow-100 transition-colors"
                      title="Remove from favorites"
                    >
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </button>
                    <button
                      onClick={() => startEdit(contact)}
                      className="p-1 rounded-full hover:bg-earth-100 transition-colors"
                      title="Edit contact"
                    >
                      <Edit3 className="w-4 h-4 text-earth-600" />
                    </button>
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="p-1 rounded-full hover:bg-red-100 transition-colors"
                      title="Delete contact"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-earth-500" />
                    <span className="text-sm font-body text-earth-700">{contact.phone}</span>
                  </div>
                  {contact.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-earth-500" />
                      <span className="text-sm font-body text-earth-700">{contact.address}</span>
                    </div>
                  )}
                  {contact.hours && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-earth-500" />
                      <span className="text-sm font-body text-earth-700">{contact.hours}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCall(contact.phone)}
                    className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg transition-colors font-body font-semibold flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  {contact.address && (
                    <button
                      onClick={() => handleGetDirections(contact.address!)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors font-body font-semibold flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Directions
                    </button>
                  )}
                </div>

                {contact.notes && (
                  <div className="mt-3 pt-3 border-t border-earth-200">
                    <p className="text-sm text-earth-600 font-body">{contact.notes}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Contacts */}
      {regularContacts.length > 0 && (
        <div>
          <h4 className="text-lg font-display font-semibold text-earth-800 mb-3">All Contacts</h4>
          <div className="space-y-3">
            {regularContacts.map((contact) => (
              <motion.div
                key={contact.id}
                whileHover={{ scale: 1.01 }}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-earth-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${getContactColor(contact.type)}`}>
                      {getContactIcon(contact.type)}
                    </div>
                    <div>
                      <h5 className="font-body font-semibold text-earth-900">{contact.name}</h5>
                      <p className="text-sm text-earth-600 font-body">{getTypeLabel(contact.type)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(contact.id)}
                      className="p-1 rounded-full hover:bg-yellow-100 transition-colors"
                      title="Add to favorites"
                    >
                      <Star className="w-4 h-4 text-earth-400 hover:text-yellow-500" />
                    </button>
                    <button
                      onClick={() => startEdit(contact)}
                      className="p-1 rounded-full hover:bg-earth-100 transition-colors"
                      title="Edit contact"
                    >
                      <Edit3 className="w-4 h-4 text-earth-600" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCall(contact.phone)}
                    className="flex-1 bg-earth-200 hover:bg-teal-500 hover:text-white text-earth-700 py-2 px-4 rounded-lg transition-colors font-body font-semibold flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  {contact.address && (
                    <button
                      onClick={() => handleGetDirections(contact.address!)}
                      className="flex-1 bg-earth-200 hover:bg-orange-500 hover:text-white text-earth-700 py-2 px-4 rounded-lg transition-colors font-body font-semibold flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Directions
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Contact Modal */}
      {showAddContact && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowAddContact(false);
            setEditingContact(null);
            setNewContact({
              name: '',
              type: 'vet',
              phone: '',
              address: '',
              hours: '',
              notes: '',
              isFavorite: false
            });
          }}
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
                {editingContact ? 'Edit Contact' : 'Add New Contact'}
              </h3>
              <button
                onClick={() => {
                  setShowAddContact(false);
                  setEditingContact(null);
                }}
                className="p-2 rounded-full hover:bg-earth-100 transition-colors"
              >
                <Plus className="w-5 h-5 text-earth-600 rotate-45" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-body font-medium text-earth-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={newContact.name || ''}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white font-body"
                  placeholder="Contact name"
                />
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-earth-700 mb-2">
                  Type
                </label>
                <select
                  value={newContact.type || 'vet'}
                  onChange={(e) => setNewContact(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white font-body"
                >
                  <option value="vet">Veterinarian</option>
                  <option value="emergency">Emergency</option>
                  <option value="specialist">Specialist</option>
                  <option value="groomer">Groomer</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-earth-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={newContact.phone || ''}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white font-body"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-earth-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={newContact.address || ''}
                  onChange={(e) => setNewContact(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white font-body"
                  placeholder="123 Main St, City, State"
                />
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-earth-700 mb-2">
                  Hours
                </label>
                <input
                  type="text"
                  value={newContact.hours || ''}
                  onChange={(e) => setNewContact(prev => ({ ...prev, hours: e.target.value }))}
                  className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white font-body"
                  placeholder="Mon-Fri: 8AM-6PM"
                />
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-earth-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newContact.notes || ''}
                  onChange={(e) => setNewContact(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white font-body resize-none"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="favorite"
                  checked={newContact.isFavorite || false}
                  onChange={(e) => setNewContact(prev => ({ ...prev, isFavorite: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 border-earth-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="favorite" className="text-sm font-body text-earth-700">
                  Add to favorites
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddContact(false);
                    setEditingContact(null);
                  }}
                  className="flex-1 px-4 py-2 border border-earth-200 text-earth-700 rounded-lg hover:bg-earth-50 transition-colors font-body"
                >
                  Cancel
                </button>
                <button
                  onClick={editingContact ? updateContact : addContact}
                  className="flex-1 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-body font-semibold"
                >
                  {editingContact ? 'Update' : 'Add'} Contact
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default EmergencyContacts;
