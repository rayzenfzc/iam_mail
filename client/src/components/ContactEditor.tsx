import React, { useState } from 'react';
import { X, User, Mail, Phone, Briefcase, Users } from 'lucide-react';

interface Contact {
  id?: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  group: string;
}

interface ContactEditorProps {
  darkMode: boolean;
  contact?: Contact | null;
  onSave: (contact: Contact) => void;
  onCancel: () => void;
}

export const ContactEditor: React.FC<ContactEditorProps> = ({
  darkMode,
  contact,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Contact>(contact || {
    name: '',
    email: '',
    phone: '',
    role: '',
    group: 'Team'
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      alert('Name and Email are required');
      return;
    }
    onSave(formData);
  };

  const groups = ['Executive', 'Team', 'Partners', 'Clients', 'Vendors'];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${
      darkMode ? 'bg-[#050505]/80' : 'bg-[#FAFAFA]/80'
    }`}>
      <div className={`w-full max-w-lg mx-4 rounded-xl border shadow-2xl ${
        darkMode ? 'bg-[#111] border-white/10' : 'bg-white border-neutral-200'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-neutral-500/10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-light">{contact ? 'Edit Contact' : 'New Contact'}</h2>
            <p className="text-xs opacity-50 mt-1">Add contact details below</p>
          </div>
          <button onClick={onCancel} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/5' : 'hover:bg-neutral-100'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 mb-2">
              <User className="w-3 h-3" />
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className={`w-full p-3 rounded-lg border outline-none text-sm ${
                darkMode 
                  ? 'bg-[#0A0A0A] border-white/10 text-white placeholder:text-neutral-600' 
                  : 'bg-neutral-50 border-neutral-200 text-black placeholder:text-neutral-400'
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 mb-2">
              <Mail className="w-3 h-3" />
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@company.com"
              className={`w-full p-3 rounded-lg border outline-none text-sm ${
                darkMode 
                  ? 'bg-[#0A0A0A] border-white/10 text-white placeholder:text-neutral-600' 
                  : 'bg-neutral-50 border-neutral-200 text-black placeholder:text-neutral-400'
              }`}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 mb-2">
              <Phone className="w-3 h-3" />
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+971 55 123 4567"
              className={`w-full p-3 rounded-lg border outline-none text-sm ${
                darkMode 
                  ? 'bg-[#0A0A0A] border-white/10 text-white placeholder:text-neutral-600' 
                  : 'bg-neutral-50 border-neutral-200 text-black placeholder:text-neutral-400'
              }`}
            />
          </div>

          {/* Role */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 mb-2">
              <Briefcase className="w-3 h-3" />
              Role/Position
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="Senior Analyst"
              className={`w-full p-3 rounded-lg border outline-none text-sm ${
                darkMode 
                  ? 'bg-[#0A0A0A] border-white/10 text-white placeholder:text-neutral-600' 
                  : 'bg-neutral-50 border-neutral-200 text-black placeholder:text-neutral-400'
              }`}
            />
          </div>

          {/* Group */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 mb-2">
              <Users className="w-3 h-3" />
              Group
            </label>
            <select
              value={formData.group}
              onChange={(e) => setFormData({ ...formData, group: e.target.value })}
              className={`w-full p-3 rounded-lg border outline-none text-sm ${
                darkMode 
                  ? 'bg-[#0A0A0A] border-white/10 text-white' 
                  : 'bg-neutral-50 border-neutral-200 text-black'
              }`}
            >
              {groups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-neutral-500/10 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className={`px-6 py-2 rounded-lg border text-sm font-bold uppercase tracking-wider transition-colors ${
              darkMode 
                ? 'border-white/10 hover:bg-white/5' 
                : 'border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-red-600 text-white text-sm font-bold uppercase tracking-wider hover:shadow-lg transition-all"
          >
            {contact ? 'Update' : 'Create'} Contact
          </button>
        </div>
      </div>
    </div>
  );
};