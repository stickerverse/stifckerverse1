import React from 'react';
import { useDropzone, DropzoneProps } from 'react-dropzone';
import { UploadIcon, ImageIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PremiumSectionHeading } from './PremiumSectionHeading';

export interface Props extends DropzoneProps {
  isUploading?: boolean;
  uploadError?: string | null;
  onSampleSelect?: (imageUrl: string) => void;
}

export function StyledDropzone({ isUploading = false, uploadError = null, ...props }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    ...props
  });

  // Sample designs that users can try
  const sampleImages = [
    { src: 'https://images.unsplash.com/photo-1596920566403-2072ed942644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', alt: 'Plant design' },
    { src: 'https://images.unsplash.com/photo-1494253109108-2e30c049369b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', alt: 'Sunset design' },
    { src: 'https://images.unsplash.com/photo-1554110397-9bac083977c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', alt: 'Mountain design' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <PremiumSectionHeading 
          title="Upload Your Artwork" 
          description="Start with your own design or photo" 
          className="mb-4"
        />
        <div
          {...getRootProps()}
          className={`relative p-10 border-2 border-dashed rounded-xl transition-all duration-300 bg-gradient-to-b cursor-pointer ${
            isDragActive 
              ? 'from-primary/5 to-white border-primary/40' 
              : 'from-muted to-white border-border/70 hover:border-primary/30 hover:from-primary/5'
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-5">
            {isUploading ? (
              <div className="space-y-4 py-8">
                <div className="relative h-16 w-16 mx-auto">
                  <div className="absolute inset-0 border-t-2 border-primary/30 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
                  <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
                </div>
                <p className="text-sm font-medium text-muted-foreground">Processing your artwork...</p>
              </div>
            ) : (
              <>
                <input {...getInputProps()} />
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <UploadIcon className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">
                    {isDragActive ? 'Drop your artwork here' : 'Drag & drop your artwork here'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    High-quality PNG or JPG, up to 10MB
                  </p>
                </div>
                <Button size="lg" className="px-8 h-12">Browse Files</Button>
                {uploadError && (
                  <div className="mt-2 text-sm text-destructive">
                    {uploadError}
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Design tips */}
          {!isUploading && (
            <div className="absolute top-3 right-3 rounded-lg bg-muted/80 backdrop-blur-sm text-xs py-1 px-2 text-muted-foreground">
              Tip: Use transparent PNGs for best results
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <Separator />
        <div className="text-center text-sm text-muted-foreground py-1">OR TRY ONE OF OUR SAMPLE IMAGES</div>
        <Separator />
      </div>
      
      {/* Sample designs */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sampleImages.map((image, index) => (
            <div 
              key={index}
              className="relative overflow-hidden rounded-xl border border-border group cursor-pointer hover:border-primary/30 transition-all"
              onClick={() => {
                // Call the sample select handler if provided
                if (props.onSampleSelect) {
                  props.onSampleSelect(image.src);
                }
              }}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                <Button className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> Use This <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
