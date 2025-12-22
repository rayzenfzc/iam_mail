import { useState } from 'react';
import ThreePaneLayout from '@/components/ThreePaneLayout';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`w-full h-screen overflow-hidden transition-colors duration-500 ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      <ThreePaneLayout
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
    </div>
  );
};

export default App;

