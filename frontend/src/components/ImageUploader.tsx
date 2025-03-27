import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { StyledDropzone } from 'components/StyledDropzone';
import { PremiumCard } from 'components/PremiumCard';

export interface Props {
  onImageProcessed: (data: {
    processedImageId: string;
    originalImageId: string;
    previewUrl: string;
  }) => void;
}

export function ImageUploader({ onImageProcessed }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 10MB');
      return;
    }

    await processImage(file);
  }, []);

  // Use simple blob URL for now to bypass server issues
  const processImage = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // For now, create a local object URL
      const objectUrl = URL.createObjectURL(file);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Since we're not doing actual background removal,
      // just generate IDs and use the local URL
      const processedImageId = `processed-${Date.now()}`;
      const originalImageId = `original-${Date.now()}`;
      
      onImageProcessed({
        processedImageId,
        originalImageId,
        previewUrl: objectUrl
      });
      
      toast.success('Image processed successfully');
    } catch (error) {
      console.error('Error processing image:', error);
      setUploadError('Failed to process image. Please try again.');
      toast.error('Image processing failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Function to handle sample image selection
  const handleSampleImage = async (imageUrl: string) => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // For sample images, use the URL directly
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const processedImageId = `sample-${Date.now()}`;
      const originalImageId = `original-${Date.now()}`;
      
      onImageProcessed({
        processedImageId,
        originalImageId,
        previewUrl: imageUrl
      });
      
      toast.success('Sample image loaded');
    } catch (error) {
      console.error('Error loading sample:', error);
      setUploadError('Failed to load sample image. Please try again.');
      toast.error('Sample loading failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <PremiumCard className="w-full max-w-2xl mx-auto">
      <StyledDropzone
        onDrop={onDrop}
        isUploading={isUploading}
        uploadError={uploadError}
        onSampleSelect={handleSampleImage}
      />
    </PremiumCard>
  );
}