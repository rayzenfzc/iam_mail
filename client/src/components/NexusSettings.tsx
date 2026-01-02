import React from 'react';
import { SettingsPage } from './settings/SettingsPage';
import { ThemeMode } from '../types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    themeMode?: ThemeMode;
    isDarkMode?: boolean;
    onThemeModeChange?: (mode: ThemeMode) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    themeMode,
    isDarkMode
}) => {
    if (!isOpen) return null;

    // Determine dark mode from either prop
    const effectiveDarkMode = isDarkMode ?? (themeMode === 'dark');

    return (
        <SettingsPage
            onClose={onClose}
            darkMode={effectiveDarkMode}
        />
    );
};

export default SettingsModal;
