import React from 'react';
import { ChildIcon, PosterIcon } from './icons';

interface HomeScreenProps {
  setMode: (mode: 'POSTER' | 'CHILD') => void;
}

const ChoiceCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void; }> = ({ title, description, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl hover:scale-105"
  >
    {icon}
    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">{title}</h2>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

export const HomeScreen: React.FC<HomeScreenProps> = ({ setMode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <ChoiceCard
        title="AI Ad Poster Generator"
        description="Create professional posters for your school, business, or event in seconds."
        icon={<PosterIcon />}
        onClick={() => setMode('POSTER')}
      />
      <ChoiceCard
        title="AI Future Glimpse"
        description="Upload photos of two parents to get a glimpse of their potential future child."
        icon={<ChildIcon />}
        onClick={() => setMode('CHILD')}
      />
    </div>
  );
};
