import React, { useState, useCallback } from 'react';
import type { PosterFormData } from '../types';
import { ImageUploader } from './ImageUploader';
import { GeneratedImage } from './GeneratedImage';
import { LoadingSpinner, SparklesIcon } from './icons';
import { generatePoster } from '../services/geminiService';

interface PosterGeneratorProps {
  onDownload: () => void;
}

const POSTER_CATEGORIES = ["School", "NGO", "Hospital", "Grocery Store", "Hostel", "Hotel", "Corporate Event", "Music Concert", "Restaurant"];

export const PosterGenerator: React.FC<PosterGeneratorProps> = ({ onDownload }) => {
    const [formData, setFormData] = useState<PosterFormData>({
        category: POSTER_CATEGORIES[0],
        organizationName: '',
        directorName: '',
        teamMembers: '',
        topic: '',
        subtopic: '',
        description: '',
        achievements: '',
        logo: null,
        extraImage: null,
    });
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (field: 'logo' | 'extraImage') => (base64: string | null) => {
        setFormData(prev => ({ ...prev, [field]: base64 }));
    };

    const handleGenerate = useCallback(async () => {
        if (!formData.organizationName || !formData.topic || !formData.description) {
            setError("Organization Name, Topic, and Description are required.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const image = await generatePoster(formData);
            setGeneratedImage(image);
        } catch (err) {
            console.error(err);
            setError("Failed to generate poster. The AI may be busy or the inputs may be unsuitable. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [formData]);

    const isFormValid = formData.organizationName && formData.topic && formData.description;

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700 dark:text-gray-300">Poster Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Text Inputs Column */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                            <select id="category" name="category" value={formData.category} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                {POSTER_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Organization Name*</label>
                            <input type="text" name="organizationName" id="organizationName" value={formData.organizationName} onChange={handleInputChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Topic / Headline*</label>
                            <input type="text" name="topic" id="topic" value={formData.topic} onChange={handleInputChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description*</label>
                            <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleInputChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"></textarea>
                        </div>
                         <div>
                            <label htmlFor="directorName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Director Name</label>
                            <input type="text" name="directorName" id="directorName" value={formData.directorName} onChange={handleInputChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md" />
                        </div>
                         <div>
                            <label htmlFor="teamMembers" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Team Members</label>
                            <input type="text" name="teamMembers" id="teamMembers" value={formData.teamMembers} onChange={handleInputChange} placeholder="e.g. John, Jane, Sam" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="achievements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Achievements</label>
                            <textarea name="achievements" id="achievements" rows={2} value={formData.achievements} onChange={handleInputChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"></textarea>
                        </div>
                    </div>
                    {/* Image Uploads Column */}
                    <div className="space-y-6">
                        <ImageUploader title="Logo (Optional)" onImageUpload={handleImageUpload('logo')} aspectRatio="square" />
                        <ImageUploader title="Extra Image for Creativity (Optional)" onImageUpload={handleImageUpload('extraImage')} aspectRatio="portrait" />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-6 rounded-md" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                <button
                    onClick={handleGenerate}
                    disabled={!isFormValid || isLoading}
                    className="w-full mt-8 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                >
                    {isLoading ? <><LoadingSpinner />Generating Poster...</> : <><SparklesIcon />Generate Poster</>}
                </button>
            </div>

            {isLoading && (
                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">The AI is designing your poster...</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">This may take a moment. Please be patient.</p>
                </div>
            )}

            {generatedImage && !isLoading && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700 dark:text-gray-300">Your Generated Poster</h2>
                    <div className="max-w-md mx-auto">
                      <GeneratedImage src={generatedImage} index={1} onDownload={onDownload} />
                    </div>
                </div>
            )}
        </div>
    );
};
