import React from 'react';
import CalendarFullView from './CalendarFullView';
import { ThemeMode } from '../../types';

interface CalendarWidgetProps {
    theme?: ThemeMode;
}

// CalendarWidget uses CalendarFullView with day cards
const CalendarWidget: React.FC<CalendarWidgetProps> = ({ theme = 'dark' }) => {
    return <CalendarFullView theme={theme} />;
};

export default CalendarWidget;
