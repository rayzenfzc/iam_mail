
import React from 'react';
import { Mail, Calendar, CheckSquare, FileText, Users, Folder, Settings, Cloud, Inbox, Star, Send, File, Archive, Trash2, Plus, CornerUpLeft } from 'lucide-react';
import { Email, Module, ActiveModule } from './types';

export const MOCK_EMAILS: Email[] = [
  {
    id: '1',
    sender: 'John Doe',
    initials: 'JD',
    time: '2:30 PM',
    subject: 'Meeting Tomorrow',
    preview: "Let's meet at 10am to discuss the new project timeline and deliverables. I've prepared some early sketches.",
    read: false
  },
  {
    id: '2',
    sender: 'Sarah Chen',
    initials: 'SC',
    time: '1:15 PM',
    subject: 'Q1 Reports Ready for Review',
    preview: "Hi team, I've completed the quarterly reports and uploaded them to the shared drive. Please take a look when you have a moment.",
    read: true
  },
  {
    id: '3',
    sender: 'Mike Johnson',
    initials: 'MJ',
    time: '11:45 AM',
    subject: 'Design System Updates',
    preview: "The new design tokens have been added to Figma. Please review and provide feedback by end of day Friday.",
    read: false
  },
  {
    id: '4',
    sender: 'Emily Rodriguez',
    initials: 'ER',
    time: '10:20 AM',
    subject: 'Client Presentation Deck',
    preview: "Attached is the final version of the presentation for tomorrow's client meeting. Good luck everyone!",
    read: true
  },
  {
    id: '5',
    sender: 'David Park',
    initials: 'DP',
    time: 'Yesterday',
    subject: 'Code Review Request',
    preview: "Could you review the PR for the new authentication flow? It's ready for merge and passed all unit tests.",
    read: true
  },
  {
    id: '6',
    sender: 'Lisa Anderson',
    initials: 'LA',
    time: 'Yesterday',
    subject: 'Team Lunch Friday',
    preview: "Hey everyone! Let's do team lunch this Friday at 12:30. I'm thinking Italian at that place down the street.",
    read: true
  },
  {
    id: '7',
    sender: 'Alex Rivera',
    initials: 'AR',
    time: '2 Days Ago',
    subject: 'Project Handover',
    preview: "I've compiled all the necessary documentation for the handover. We should schedule a call to walk through it.",
    read: true
  }
];

export const MODULES: Module[] = [
  { id: '1', name: ActiveModule.MAIL, label: 'MODULE', icon: <Mail size={24} />, badge: 12 },
  { id: '2', name: ActiveModule.CALENDAR, label: 'MODULE', icon: <Calendar size={24} /> },
  { id: '3', name: ActiveModule.TASKS, label: 'MODULE', icon: <CheckSquare size={24} /> },
  { id: '4', name: ActiveModule.NOTES, label: 'MODULE', icon: <FileText size={24} />, badge: 2 },
  { id: '5', name: ActiveModule.CONTACTS, label: 'MODULE', icon: <Users size={24} /> },
  { id: '6', name: ActiveModule.FILES, label: 'MODULE', icon: <Folder size={24} /> },
  { id: '7', name: ActiveModule.SETTINGS, label: 'MODULE', icon: <Settings size={24} /> },
  { id: '8', name: ActiveModule.DRIVE, label: 'MODULE', icon: <Cloud size={24} /> }
];
