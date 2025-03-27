import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';

// Import Card properly - make sure this import path is correct
import { Card } from '@/components/ui/card';

export interface Props {
  previewUrl: string;
  processedImageId: string;
  originalImageId: string;
  onSave: (editedImage: {
    imageId: string;
    previewUrl: string;
    rotation: number;
    borderWidth: number;
    borderColor: string;
  }) => void;
  onCancel: () => void;
}

export function ImageEditor({
  previewUrl,
  processedImageId,
  originalImageId,
  onSave,
  onCancel
}: Props) {
  const [rotation, setRotation] = useState(0);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState('#000000');
  const [isProcessing, setIsProcessing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleRotationChange = (value: number[]) => {
    setRotation(value[0]);
  };

  const handleBorderWidthChange = (value: number[]) => {
    setBorderWidth(value[0]);
  };

  const handleRemoveBackground = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate background removal with a timeout
      // In production, replace this with your actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Background removed successfully');
      
      // Use the same image for now (in production, this would be the processed image)
      onSave({
        imageId: processedImageId,
        previewUrl: previewUrl, 
        rotation,
        borderWidth,
        borderColor,
      });
    } catch (error) {
      console.error('Error removing background:', error);
      toast.error('Failed to remove background. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    onSave({
      imageId: processedImageId,
      previewUrl,
      rotation,
      borderWidth,
      borderColor,
    });
  };

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2">
          <div className="aspect-square rounded-lg overflow-hidden border relative flex items-center justify-center">
            <div 
              className="relative inline-block max-h-full max-w-full"
              style={{
                transform: `rotate(${rotation}deg)`,
                border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
              }}
            >
              {isProcessing ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                  <div className="h-10 w-10 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                </div>
              ) : null}
              <img
                ref={imageRef}
                src={previewUrl}
                alt="Uploaded sticker"
                className="max-h-full max-w-full object-contain"
                style={{ opacity: isProcessing ? 0.7 : 1 }}
              />
            </div>
          </div>
        </div>
        
        <div className="col-span-1 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Background Removal</h3>
            <Button 
              onClick={handleRemoveBackground} 
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Removing Background...' : 'Remove Background'}
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Rotation</h3>
            <Slider
              min={0}
              max={360}
              step={1}
              value={[rotation]}
              onValueChange={handleRotationChange}
              disabled={isProcessing}
            />
            <p className="text-xs text-gray-500 text-right">{rotation}°</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Border Width</h3>
            <Slider
              min={0}
              max={20}
              step={1}
              value={[borderWidth]}
              onValueChange={handleBorderWidthChange}
              disabled={isProcessing}
            />
            <p className="text-xs text-gray-500 text-right">{borderWidth}px</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Border Color</h3>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                className="w-full h-10"
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isProcessing}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}