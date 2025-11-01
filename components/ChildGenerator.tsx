import React, { useState, useCallback } from 'react';
import { ImageUploader } from './ImageUploader';
import { Guide } from './Guide';
import { GeneratedImage } from './GeneratedImage';
import { LoadingSpinner, SparklesIcon } from './icons';
import { generateChildImages } from '../services/geminiService';

interface ChildGeneratorProps {
  onDownload: () => void;
}

export const ChildGenerator: React.FC<ChildGeneratorProps> = ({ onDownload }) => {
  const [fatherImage, setFatherImage] = useState<string | null>(null);
  const [motherImage, setMotherImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!fatherImage || !motherImage) {
      setError("Please upload both parents' images.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const images = await generateChildImages(fatherImage, motherImage);
      setGeneratedImages(images);
    } catch (err) {
      console.error(err);
      setError("Failed to generate images. The AI may be busy, or the images might not be suitable. Please try again with different photos.");
    } finally {
      setIsLoading(false);
    }
  }, [fatherImage, motherImage]);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700 dark:text-gray-300">Upload Parent Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ImageUploader title="Father's Photo" onImageUpload={setFatherImage} />
            <ImageUploader title="Mother's Photo" onImageUpload={setMotherImage} />
            </div>
            
            {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
            )}

            <button
            onClick={handleGenerate}
            disabled={!fatherImage || !motherImage || isLoading}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
            {isLoading ? (
                <>
                <LoadingSpinner />
                Generating...
                </>
            ) : (
                <>
                <SparklesIcon />
                Generate Child Images
                </>
            )}
            </button>
        </div>
        
        {isLoading && (
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Our AI is envisioning the future...</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">This can take up to a minute. Please be patient.</p>
            </div>
        )}

        {generatedImages.length > 0 && !isLoading && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700 dark:text-gray-300">Generated Images</h2>
            <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((src, index) => (
                <GeneratedImage key={index} src={src} index={index + 1} onDownload={onDownload} />
                ))}
            </div>
            </div>
        )}

        <Guide />
    </div>
  );
};
