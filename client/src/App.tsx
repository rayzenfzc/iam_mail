import { useState, useEffect } from 'react';
import ThreePaneLayout from '@/components/ThreePaneLayout';
import BiometricLogin from '@/components/BiometricLogin';
import { ViewState } from '@/types';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`w-full h-screen overflow-hidden transition-colors duration-500 ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      {!isLoggedIn ? (
        <BiometricLogin
          onLogin={() => setIsLoggedIn(true)}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      ) : (
        <ThreePaneLayout
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      )}
    </div>
  );
};

export default App;
