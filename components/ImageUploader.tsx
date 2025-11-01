import React, { useState, useCallback } from 'react';
import type { ImageUploaderProps } from '../types';
import { UploadIcon } from './icons';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onImageUpload, aspectRatio = 'square' }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const aspectRatioClass = aspectRatio === 'square' ? 'aspect-square' : 'aspect-[3/4]';

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError("File size exceeds 4MB.");
        onImageUpload(null);
        setImagePreview(null);
        return;
      }
      try {
        const base64 = await fileToBase64(file);
        setImagePreview(base64);
        onImageUpload(base64);
      } catch (err) {
        setError("Could not read file.");
        onImageUpload(null);
        setImagePreview(null);
      }
    }
  }, [onImageUpload]);

  return (
    <div className="flex flex-col items-center">
      <h3 className="font-medium text-lg mb-3 text-gray-600 dark:text-gray-400">{title}</h3>
      <label htmlFor={title.replace(/\s+/g, '-')} className={`w-full ${aspectRatioClass} border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors duration-200 bg-gray-50 dark:bg-gray-700/50`}>
        {imagePreview ? (
          <img src={imagePreview} alt={`${title} preview`} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 p-4">
            <UploadIcon />
            <p className="mt-2 text-sm">Click to upload</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">PNG, JPG, WEBP</p>
          </div>
        )}
        <input
          id={title.replace(/\s+/g, '-')}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};
