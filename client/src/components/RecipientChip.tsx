import React from 'react';

interface RecipientChipProps {
  email: string;
  onRemove: () => void;
  darkMode: boolean;
}

export const RecipientChip: React.FC<RecipientChipProps> = ({ email, onRemove, darkMode }) => (
  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${
    darkMode ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'bg-violet-100 text-violet-700 border border-violet-300'
  }`}>
    <span>{email}</span>
    <button
      onClick={onRemove}
      className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
        darkMode ? 'hover:bg-red-500/30 text-red-400' : 'hover:bg-red-100 text-red-600'
      }`}
    >
      ×
    </button>
  </div>
);
