
import React from 'react';

export interface Email {
  id: string;
  sender: string;
  initials: string;
  time: string;
  subject: string;
  preview: string;
  read: boolean;
}

export interface Module {
  id: string;
  name: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export enum ActiveModule {
  MAIL = 'Mail',
  CALENDAR = 'Calendar',
  TASKS = 'Tasks',
  NOTES = 'Notes',
  CONTACTS = 'Contacts',
  FILES = 'Files',
  SETTINGS = 'Settings',
  DRIVE = 'Drive'
}