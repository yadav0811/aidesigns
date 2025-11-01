export interface ImageUploaderProps {
  title: string;
  onImageUpload: (base64: string | null) => void;
  aspectRatio?: 'square' | 'portrait';
}

export interface GeneratedImageProps {
  src: string;
  index: number;
  onDownload: () => void;
}

export interface PosterFormData {
    category: string;
    organizationName: string;
    directorName: string;
    teamMembers: string;
    topic: string;
    subtopic: string;
    description: string;
    achievements: string;
    logo: string | null;
    extraImage: string | null;
}
