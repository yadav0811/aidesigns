import React from 'react';
import type { GeneratedImageProps } from '../types';
import { DownloadIcon } from './icons';

export const GeneratedImage: React.FC<GeneratedImageProps> = ({ src, index, onDownload }) => {
  const fileName = `ai_generated_image_${index}.png`;

  const handleDownloadClick = () => {
    // This function is called when the user clicks the download link.
    // It will trigger the trial lock logic in the App component.
    onDownload();
  };

  return (
    <div className="relative group aspect-square">
      <img src={src} alt={`Generated image ${index}`} className="w-full h-full object-cover rounded-lg shadow-md" />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex justify-center items-center">
        <a
          href={src}
          download={fileName}
          onClick={handleDownloadClick}
          className="flex items-center gap-2 bg-white text-gray-800 font-semibold py-2 px-4 rounded-full opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90 transition-all duration-300 ease-in-out"
        >
          <DownloadIcon />
          Download
        </a>
      </div>
    </div>
  );
};
