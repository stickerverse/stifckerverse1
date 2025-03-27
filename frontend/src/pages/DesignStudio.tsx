import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageUploader } from 'components/ImageUploader';
import { StudioCanvas } from 'components/StudioCanvas';
import { AppContainer } from 'components/AppContainer';
import { Button } from '@/components/ui/button';
import { StickerType, StickerMaterial, useCartStore, calculatePrice } from 'utils/cartStore';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { DesignSteps } from 'components/DesignSteps';
import { PremiumCard } from 'components/PremiumCard';
import { PremiumSectionHeading } from 'components/PremiumSectionHeading';
import { StickerTypeGrid } from 'components/StickerTypeGrid';

enum DesignStep {
  UPLOAD = 'upload',
  EDIT = 'edit',
  CUSTOMIZE = 'customize',
}

interface ProcessedImage {
  processedImageId: string;
  originalImageId: string;
  previewUrl: string;
}

interface EditedImage {
  imageId: string;
  previewUrl: string;
  rotation: number;
  borderWidth: number;
  borderColor: string;
  text?: string;
  textProps?: {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
}

export default function DesignStudio() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<DesignStep>(DesignStep.UPLOAD);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [editedImage, setEditedImage] = useState<EditedImage | null>(null);
  const [stickerType, setStickerType] = useState<StickerType>('die-cut');
  const [material, setMaterial] = useState<StickerMaterial>('gloss');
  const [quantity, setQuantity] = useState<number>(5);
  const addItem = useCartStore((state) => state.addItem);
  
  const price = editedImage ? calculatePrice(stickerType, material, quantity) : 0;

  const handleImageProcessed = (imageData: ProcessedImage) => {
    console.log('Image processed data received:', imageData);
    // Ensure we have a valid preview URL
    if (!imageData.previewUrl) {
      console.error('No preview URL in the processed image data', imageData);
      toast.error('Error processing image preview');
      return;
    }
    
    setProcessedImage(imageData);
    setCurrentStep(DesignStep.EDIT);
  };

  const handleImageEdited = (imageData: EditedImage) => {
    setEditedImage(imageData);
    setCurrentStep(DesignStep.CUSTOMIZE);
  };

  const handleCancel = () => {
    // Go back to upload step
    setProcessedImage(null);
    setEditedImage(null);
    setCurrentStep(DesignStep.UPLOAD);
  };
  
  const handleAddToCart = () => {
    if (!editedImage) return;
    
    addItem({
      imageId: editedImage.imageId,
      previewUrl: editedImage.previewUrl,
      rotation: editedImage.rotation,
      borderWidth: editedImage.borderWidth,
      borderColor: editedImage.borderColor,
      stickerType,
      material,
      quantity,
      price
    });
    
    toast.success('Added to cart!', {
      description: 'Your custom sticker has been added to your cart.'
    });
    navigate('/cart');
  };

  return (
    <AppContainer>
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl">
        <h1 className="text-4xl font-bold text-center tracking-tight mb-3">Design Your Sticker</h1>
        <p className="text-muted-foreground text-center text-lg max-w-2xl mx-auto mb-12">
          Upload your artwork, edit, and customize your stickers for printing
        </p>

        {/* Enhanced Step indicators */}
        <DesignSteps 
          steps={[
            { id: DesignStep.UPLOAD, label: 'Upload' },
            { id: DesignStep.EDIT, label: 'Edit' },
            { id: DesignStep.CUSTOMIZE, label: 'Customize' }
          ]}
          currentStep={currentStep}
        />

        {/* Step content */}
        <div className="mt-8">
          {currentStep === DesignStep.UPLOAD && (
            <ImageUploader onImageProcessed={handleImageProcessed} />
          )}

          {currentStep === DesignStep.EDIT && processedImage && (
            <StudioCanvas
              previewUrl={processedImage.previewUrl}
              processedImageId={processedImage.processedImageId}
              originalImageId={processedImage.originalImageId}
              onSave={handleImageEdited}
              onCancel={handleCancel}
            />
          )}

          {currentStep === DesignStep.CUSTOMIZE && editedImage && (
            <div className="max-w-5xl mx-auto">
              <PremiumCard className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Preview section */}
                  <div className="col-span-1 flex flex-col items-center justify-center">
                    <PremiumSectionHeading title="Your Sticker" className="mb-4" />
                    <div className="rounded-xl overflow-hidden h-56 w-56 flex items-center justify-center bg-muted/50 p-4 border border-border/50 shadow-md">
                      <img
                        src={editedImage.previewUrl}
                        alt="Your edited sticker"
                        className="max-h-full max-w-full object-contain"
                      />
                      {editedImage.text && (
                        <div className="absolute text-center">
                          <p
                            style={{
                              fontFamily: editedImage.textProps?.fontFamily || 'Arial',
                              fontSize: `${editedImage.textProps?.fontSize || 16}px`,
                              color: editedImage.textProps?.fontColor || '#000',
                              fontWeight: editedImage.textProps?.bold ? 'bold' : 'normal',
                              fontStyle: editedImage.textProps?.italic ? 'italic' : 'normal',
                              textDecoration: editedImage.textProps?.underline ? 'underline' : 'none',
                            }}
                          >
                            {editedImage.text}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Options section */}
                  <div className="col-span-1 md:col-span-2">
                    <div className="space-y-8">
                      <div>
                        <PremiumSectionHeading 
                          title="Sticker Type" 
                          description="Choose the perfect shape for your sticker" 
                          className="mb-4" 
                        />
                        <StickerTypeGrid 
                          selectedType={stickerType}
                          onChange={(value) => setStickerType(value)}
                        />
                      </div>

                      <div>
                        <PremiumSectionHeading 
                          title="Material" 
                          description="Select the finish that best suits your design" 
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                          <div 
                            onClick={() => setMaterial('gloss')} 
                            className={`cursor-pointer rounded-lg p-4 flex flex-col items-center text-center transition-all ${material === 'gloss' ? 'bg-primary/10 border-2 border-primary/20' : 'bg-muted hover:bg-muted/80 border border-border'}`}
                          >
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary/80 to-primary mb-3"></div>
                            <h4 className="font-medium">Gloss Vinyl</h4>
                            <p className="text-xs text-muted-foreground mt-1">Shiny, vibrant finish</p>
                          </div>
                          <div 
                            onClick={() => setMaterial('matte')} 
                            className={`cursor-pointer rounded-lg p-4 flex flex-col items-center text-center transition-all ${material === 'matte' ? 'bg-primary/10 border-2 border-primary/20' : 'bg-muted hover:bg-muted/80 border border-border'}`}
                          >
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 mb-3"></div>
                            <h4 className="font-medium">Matte Vinyl</h4>
                            <p className="text-xs text-muted-foreground mt-1">Elegant, non-reflective</p>
                          </div>
                          <div 
                            onClick={() => setMaterial('holographic')} 
                            className={`cursor-pointer rounded-lg p-4 flex flex-col items-center text-center transition-all ${material === 'holographic' ? 'bg-primary/10 border-2 border-primary/20' : 'bg-muted hover:bg-muted/80 border border-border'}`}
                          >
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-3"></div>
                            <h4 className="font-medium">Holographic</h4>
                            <p className="text-xs text-muted-foreground mt-1">Rainbow shimmer effect</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <PremiumSectionHeading 
                          title="Quantity" 
                          description="How many stickers would you like?" 
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                          {[5, 10, 20, 50, 100, 250, 500, 1000].map((qty) => (
                            <div 
                              key={qty}
                              onClick={() => setQuantity(qty)} 
                              className={`cursor-pointer rounded-lg p-3 text-center transition-all ${quantity === qty ? 'bg-primary/10 border-2 border-primary/20 font-medium' : 'bg-muted hover:bg-muted/80 border border-border'}`}
                            >
                              {qty} stickers
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </PremiumCard>

              {/* Order Summary */}
              <PremiumCard>
                <PremiumSectionHeading title="Order Summary" description="Review your selections before adding to cart" />
                <Separator className="mb-6" />

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">Product</span>
                    <span className="font-medium">{stickerType.replace('-', ' ')} stickers</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">Material</span>
                    <span className="font-medium">{material} vinyl</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">Quantity</span>
                    <span className="font-medium">{quantity} stickers</span>
                  </div>
                </div>
                
                <div className="flex justify-between font-semibold text-xl mb-8 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <span>Total</span>
                  <span className="text-primary">${price.toFixed(2)}</span>
                </div>

                <div className="flex space-x-4 justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleCancel} 
                    className="w-1/3 h-12 text-sm"
                    size="lg"
                  >
                    Start Over
                  </Button>
                  <Button 
                    onClick={handleAddToCart} 
                    className="w-2/3 h-12 text-sm font-medium" 
                    size="lg"
                  >
                    Add to Cart
                  </Button>
                </div>
              </PremiumCard>
            </div>
          )}
        </div>
      </div>
    </AppContainer>
  );
}