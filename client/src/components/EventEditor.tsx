import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Users, FileText } from 'lucide-react';

interface CalendarEvent {
  id?: number;
  title: string;
  date: string;
  time: string;
  loc: string;
  attendees?: string;
  description?: string;
}

interface EventEditorProps {
  darkMode: boolean;
  event?: CalendarEvent | null;
  onSave: (event: CalendarEvent) => void;
  onCancel: () => void;
}

export const EventEditor: React.FC<EventEditorProps> = ({
  darkMode,
  event,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<CalendarEvent>(event || {
    title: '',
    date: 'Dec 30',
    time: '10:00 AM',
    loc: '',
    attendees: '',
    description: ''
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.date || !formData.time) {
      alert('Title, Date, and Time are required');
      return;
    }
    onSave(formData);
  };

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
            <h2 className="text-2xl font-light">{event ? 'Edit Event' : 'New Event'}</h2>
            <p className="text-xs opacity-50 mt-1">Schedule a new calendar event</p>
          </div>
          <button onClick={onCancel} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/5' : 'hover:bg-neutral-100'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 mb-2">
              <FileText className="w-3 h-3" />
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Board Meeting"
              className={`w-full p-3 rounded-lg border outline-none text-sm ${
                darkMode 
                  ? 'bg-[#0A0A0A] border-white/10 text-white placeholder:text-neutral-600' 
                  : 'bg-neutral-50 border-neutral-200 text-black placeholder:text-neutral-400'
              }`}
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 mb-2">
                <Calendar className="w-3 h-3" />
                Date *
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="Dec 30"
                className={`w-full p-3 rounded-lg border outline-none text-sm ${
                  darkMode 
                    ? 'bg-[#0A0A0A] border-white/10 text-white placeholder:text-neutral-600' 
                    : 'bg-neutral-50 border-neutral-200 text-black placeholder:text-neutral-400'
                }`}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 mb-2">
                <Clock className="w-3 h-3" />
                Time *
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="10:00 AM"
                className={`w-full p-3 rounded-lg border outline-none text-sm ${
                  darkMode 
                    ? 'bg-[#0A0A0A] border-white/10 text-white placeholder:text-neutral-600' 
                    : 'bg-neutral-50 border-neutral-200 text-black placeholder:text-neutral-400'
                }`}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 mb-2">
              <MapPin className="w-3 h-3" />
              Location
            </label>
            <input
              type="text"
              value={formData.loc}
              onChange={(e) => setFormData({ ...formData, loc: e.target.value })}
              placeholder="Conference Room A"
              className={`w-full p-3 rounded-lg border outline-none text-sm ${
                darkMode 
                  ? 'bg-[#0A0A0A] border-white/10 text-white placeholder:text-neutral-600' 
                  : 'bg-neutral-50 border-neutral-200 text-black placeholder:text-neutral-400'
              }`}
            />
          </div>

          {/* Attendees */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 mb-2">
              <Users className="w-3 h-3" />
              Attendees
            </label>
            <input
              type="text"
              value={formData.attendees}
              onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
              placeholder="john@company.com, sarah@company.com"
              className={`w-full p-3 rounded-lg border outline-none text-sm ${
                darkMode 
                  ? 'bg-[#0A0A0A] border-white/10 text-white placeholder:text-neutral-600' 
                  : 'bg-neutral-50 border-neutral-200 text-black placeholder:text-neutral-400'
              }`}
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 mb-2">
              <FileText className="w-3 h-3" />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add agenda, notes, or meeting details..."
              rows={3}
              className={`w-full p-3 rounded-lg border outline-none text-sm resize-none ${
                darkMode 
                  ? 'bg-[#0A0A0A] border-white/10 text-white placeholder:text-neutral-600' 
                  : 'bg-neutral-50 border-neutral-200 text-black placeholder:text-neutral-400'
              }`}
            />
          </div>

          {/* Quick Templates */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Quick Templates</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFormData({ 
                  ...formData, 
                  title: 'Team Standup', 
                  time: '09:00 AM', 
                  loc: 'Online' 
                })}
                className={`p-2 rounded-lg border text-xs transition-colors ${
                  darkMode 
                    ? 'border-white/10 hover:bg-white/5' 
                    : 'border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                Standup
              </button>
              <button
                onClick={() => setFormData({ 
                  ...formData, 
                  title: '1:1 Meeting', 
                  time: '02:00 PM', 
                  loc: 'Office' 
                })}
                className={`p-2 rounded-lg border text-xs transition-colors ${
                  darkMode 
                    ? 'border-white/10 hover:bg-white/5' 
                    : 'border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                1:1
              </button>
              <button
                onClick={() => setFormData({ 
                  ...formData, 
                  title: 'Client Call', 
                  time: '11:00 AM', 
                  loc: 'Zoom' 
                })}
                className={`p-2 rounded-lg border text-xs transition-colors ${
                  darkMode 
                    ? 'border-white/10 hover:bg-white/5' 
                    : 'border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                Client
              </button>
            </div>
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
            {event ? 'Update' : 'Create'} Event
          </button>
        </div>
      </div>
    </div>
  );
};