import React from 'react';
import CalendarFullView from '../ui/CalendarFullView';

interface CalendarPageProps {
    darkMode: boolean;
    onClose?: () => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ darkMode }) => {
    return (
        <div className="w-full h-full p-4 md:p-6 lg:p-8 overflow-y-auto no-scrollbar">
            <CalendarFullView theme={darkMode ? 'dark' : 'light'} />
        </div>
    );
};

export default CalendarPage;
