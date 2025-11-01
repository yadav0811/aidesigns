
import React from 'react';
import { CheckIcon, CrossIcon } from './icons';

const GuideItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <li className="flex items-start gap-3">
    <span className="mt-1">{icon}</span>
    <span>{text}</span>
  </li>
);

export const Guide: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">How to Get the Best Results</h2>
      
      <div>
        <h3 className="font-semibold text-lg mb-3 text-indigo-500 dark:text-indigo-400">Photo Guidelines</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          For the AI to work its magic, please provide clear, high-quality photos.
        </p>
        <ul className="space-y-3 text-gray-600 dark:text-gray-400">
          <GuideItem icon={<CheckIcon />} text="Use clear, front-facing portraits." />
          <GuideItem icon={<CheckIcon />} text="Ensure good, even lighting without harsh shadows." />
          <GuideItem icon={<CheckIcon />} text="Keep a neutral expression or a gentle smile." />
          <GuideItem icon={<CrossIcon />} text="Avoid sunglasses, hats, or anything that obscures facial features." />
          <GuideItem icon={<CrossIcon />} text="Don't use photos with heavy filters or effects." />
          <GuideItem icon={<CrossIcon />} text="Avoid group photos or pictures where the face is far away." />
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3 text-indigo-500 dark:text-indigo-400">Step-by-Step Guide</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>Upload a photo for the father in the designated box.</li>
          <li>Upload a photo for the mother in the second box.</li>
          <li>Once both images are uploaded, the generate button will activate.</li>
          <li>Click "Generate Child Images" and wait for the AI to process.</li>
          <li>Your four generated images will appear below.</li>
          <li>Click the download button on any image to save it.</li>
        </ol>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700 pt-4">
        <strong>Disclaimer:</strong> This tool is for entertainment purposes only. The generated images are an artistic interpretation by AI and not a prediction of future appearance.
      </div>
    </div>
  );
};
