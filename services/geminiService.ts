import { GoogleGenAI, Modality } from "@google/genai";
import type { PosterFormData } from "../types";

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CHILD_PROMPTS = [
  "Using the two images of the parents provided, generate a photorealistic image of what their child might look like as a toddler (around 3 years old). The output should be a single, clear portrait of the smiling child.",
  "Using the two images of the parents provided, generate a photorealistic image of what their child might look like at age 5. The output should be a single, clear portrait of the child.",
  "Based on the genetic features of the two parents in the images, create a realistic portrait of their potential child at around 6 years old, looking curious.",
  "Synthesize the features from the two parent images to generate a high-quality, realistic portrait of their potential child at age 4.",
];

const dataUrlToBlob = (dataUrl: string): { mimeType: string; data: string } => {
  const parts = dataUrl.split(',');
  const mimeType = parts[0].match(/:(.*?);/)?.[1];
  const data = parts[1];
  if (!mimeType || !data) {
    throw new Error("Invalid data URL");
  }
  return { mimeType, data };
};

export const generateChildImages = async (
  fatherImageBase64: string,
  motherImageBase64: string
): Promise<string[]> => {
  const fatherImagePart = { inlineData: dataUrlToBlob(fatherImageBase64) };
  const motherImagePart = { inlineData: dataUrlToBlob(motherImageBase64) };

  const generationPromises = CHILD_PROMPTS.map(prompt => {
    return ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          fatherImagePart,
          motherImagePart,
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
  });

  const responses = await Promise.all(generationPromises);

  const generatedImages = responses.map(response => {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const { mimeType, data } = part.inlineData;
        return `data:${mimeType};base64,${data}`;
      }
    }
    throw new Error("Image data not found in Gemini response");
  });

  return generatedImages;
};

export const generatePoster = async (formData: PosterFormData): Promise<string> => {
    const {
        category,
        organizationName,
        directorName,
        teamMembers,
        topic,
        subtopic,
        description,
        achievements,
        logo,
        extraImage
    } = formData;

    const parts: any[] = [];

    if (logo) {
        parts.push({ inlineData: dataUrlToBlob(logo) });
    }
    if (extraImage) {
        parts.push({ inlineData: dataUrlToBlob(extraImage) });
    }

    let prompt = `You are an expert graphic designer creating an advertisement poster.
    Generate a visually stunning and professional poster based on the following details.
    
    **Poster Category:** ${category}
    **Organization Name:** ${organizationName}
    **Main Topic/Headline:** ${topic}
    ${subtopic ? `**Subtopic/Tagline:** ${subtopic}` : ''}
    **Detailed Description:** ${description}
    ${achievements ? `**Key Achievements to Highlight:** ${achievements}`: ''}
    ${directorName ? `**Director:** ${directorName}` : ''}
    ${teamMembers ? `**Team Members:** ${teamMembers}`: ''}

    **Design Instructions:**
    1. The design style must match the category: '${category}'. For example, a School poster should be vibrant, a Hospital poster professional and calming, a Hotel poster luxurious.
    2. The Organization Name and Main Topic must be prominent.
    3. All text provided must be clearly legible and well-organized into a visual hierarchy.
    4. If a logo image is provided (first image), it MUST be included. Place it appropriately, usually at a top or bottom corner.
    5. If an extra image is provided for creativity (second image), it MUST be used as a central visual element or a creative background.
    6. Combine all elements into a single, cohesive, and beautiful poster image. Do not output text, only the final poster image.`;

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const { mimeType, data } = part.inlineData;
            return `data:${mimeType};base64,${data}`;
        }
    }
    
    throw new Error("Poster image data not found in Gemini response");
};
