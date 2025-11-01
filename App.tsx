import React, { useState, useCallback, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { ChildGenerator } from './components/ChildGenerator';
import { PosterGenerator } from './components/PosterGenerator';
import { PasswordLock } from './components/PasswordLock';
import { ArrowLeftIcon } from './components/icons';

type Mode = 'HOME' | 'POSTER' | 'CHILD';

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>('HOME');
  
  // Initialize state from localStorage
  const [hasUsedTrial, setHasUsedTrial] = useState<boolean>(() => {
    return localStorage.getItem('hasUsedTrial') === 'true';
  });
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('isUnlocked') === 'true';
  });

  const handleFirstDownload = useCallback(() => {
    if (!isUnlocked && !hasUsedTrial) {
      localStorage.setItem('hasUsedTrial', 'true');
      setHasUsedTrial(true);
    }
  }, [isUnlocked, hasUsedTrial]);
  
  const handleUnlock = useCallback(() => {
      localStorage.setItem('isUnlocked', 'true');
      setIsUnlocked(true);
  }, []);

  const isLocked = hasUsedTrial && !isUnlocked;

  const renderContent = () => {
    switch (mode) {
      case 'CHILD':
        return <ChildGenerator onDownload={handleFirstDownload} />;
      case 'POSTER':
        return <PosterGenerator onDownload={handleFirstDownload} />;
      case 'HOME':
      default:
        return <HomeScreen setMode={setMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {isLocked && <PasswordLock onUnlock={handleUnlock} />}
      <main className={`container mx-auto px-4 py-8 md:py-12 ${isLocked ? 'blur-md pointer-events-none' : ''}`}>
        <header className="text-center mb-10 md:mb-16">
           {mode !== 'HOME' && (
             <button 
                onClick={() => setMode('HOME')}
                className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                aria-label="Back to home"
              >
                <ArrowLeftIcon />
                Home
              </button>
           )}
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 mb-2">
            AI Creative Suite
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
            {mode === 'HOME' ? 'Choose a tool to start creating with AI.' : 
             mode === 'CHILD' ? 'Envision your future child with AI.' :
             'Generate stunning advertisement posters in seconds.'}
          </p>
        </header>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
