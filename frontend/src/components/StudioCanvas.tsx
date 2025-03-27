import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { StickerType } from 'utils/cartStore';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleIcon, SquareIcon, RectangleHorizontalIcon, Ellipsis, RotateCcwIcon, BoldIcon, ItalicIcon, UnderlineIcon, TypeIcon, ImageIcon, PaletteIcon, CircleDotIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PremiumCard } from 'components/PremiumCard';
import { PremiumSectionHeading } from 'components/PremiumSectionHeading';

export interface StudioCanvasProps {
  previewUrl: string;
  processedImageId: string;
  originalImageId?: string;
  onSave: (data: {
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
  }) => void;
  onCancel: () => void;
}

const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Comic Sans MS'
];

export function StudioCanvas({ previewUrl, processedImageId, originalImageId, onSave, onCancel }: StudioCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasInstance = useRef<fabric.Canvas | null>(null);
  const [text, setText] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState('#000000');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState('#000000');
  const [rotation, setRotation] = useState(0);
  const [stickerType, setStickerType] = useState<StickerType>('die-cut');
  const [canvasUrl, setCanvasUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const imageRef = useRef<fabric.Image | null>(null);
  const textRef = useRef<fabric.IText | null>(null);
  const [localProcessedImageId, setLocalProcessedImageId] = useState(processedImageId);

  // Initialize the canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create a new fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: 'transparent',
      width: 500,
      height: 500,
      preserveObjectStacking: true,
    });

    canvasInstance.current = canvas;

    // Load the image
    console.log('Loading image with previewUrl:', previewUrl);

    fabric.Image.fromURL(previewUrl, (img) => {
      // Center the image and scale it to fit the canvas
      console.log('Image loaded successfully, dimensions:', img.width, 'x', img.height);

      const scale = Math.min(
        (canvas.width! * 0.8) / img.width!,
        (canvas.height! * 0.8) / img.height!
      );

      img.scale(scale);
      img.set({
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: 'center',
        originY: 'center',
      });

      // Store reference to the image
      imageRef.current = img;

      // Add the image to the canvas
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    }, (err) => {
      console.error('Error loading image in fabric.js:', err);
      toast.error('Failed to load image. Please try again.');
    });

    // Cleanup
    return () => {
      canvas.dispose();
    };
  }, [previewUrl]);

  // Add text to canvas
  const addText = () => {
    if (!canvasInstance.current || !text.trim()) return;

    const canvas = canvasInstance.current;

    // Remove existing text object if it exists
    if (textRef.current) {
      canvas.remove(textRef.current);
    }

    // Create a new text object
    const textObject = new fabric.IText(text, {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      originX: 'center',
      originY: 'center',
      fontFamily,
      fontSize,
      fill: fontColor,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      underline: isUnderline,
      textAlign: 'center',
      editable: true,
      cursorWidth: 1,
      cursorColor: fontColor,
      selectBackgroundColor: 'rgba(100, 100, 255, 0.3)',
      selectionColor: 'rgba(17, 119, 255, 0.3)',
      padding: 5,
      cornerColor: 'rgba(100, 100, 255, 0.8)',
      cornerSize: 8,
      transparentCorners: false,
      borderColor: 'rgba(100, 100, 255, 0.8)',
      borderScaleFactor: 1,
    });

    // Store reference to the text
    textRef.current = textObject;

    // Add handlers to sync text object changes back to the UI
    textObject.on('changed', () => {
      if (textRef.current) {
        setText(textRef.current.text || '');
      }
    });

    // Add the text to the canvas
    canvas.add(textObject);
    canvas.setActiveObject(textObject);
    canvas.renderAll();

    // Show a helpful toast message for new users
    toast.info('Text added!', {
      description: 'Click on the text to edit directly, or drag to reposition.'
    });
  };

  // Sync text properties to the active text object
  useEffect(() => {
    if (!canvasInstance.current || !textRef.current) return;

    // Only update if the text object exists and is on the canvas
    textRef.current.set({
      fontFamily,
      fontSize,
      fill: fontColor,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      underline: isUnderline,
    });

    canvasInstance.current.renderAll();
  }, [fontFamily, fontSize, fontColor, isBold, isItalic, isUnderline]);

  // Apply border to the image
  useEffect(() => {
    if (!canvasInstance.current || !imageRef.current) return;

    const img = imageRef.current;
    img.set({
      stroke: borderColor,
      strokeWidth: borderWidth,
    });

    canvasInstance.current.renderAll();
  }, [borderWidth, borderColor]);

  // Apply rotation to the image
  useEffect(() => {
    if (!canvasInstance.current || !imageRef.current) return;

    const img = imageRef.current;
    img.set({ angle: rotation });

    canvasInstance.current.renderAll();
  }, [rotation]);

  // Update the sticker shape based on the selected type
  useEffect(() => {
    if (!canvasInstance.current || !imageRef.current) return;

    const canvas = canvasInstance.current;
    const img = imageRef.current;

    // Reset any existing clipPath
    img.clipPath = undefined;

    // Apply clip path based on sticker type
    if (stickerType !== 'die-cut') {
      const width = img.getScaledWidth();
      const height = img.getScaledHeight();

      let clipPath;

      switch (stickerType) {
        case 'circular':
          clipPath = new fabric.Circle({
            radius: Math.min(width, height) / 2,
            originX: 'center',
            originY: 'center',
          });
          break;
        case 'oval':
          clipPath = new fabric.Ellipse({
            rx: width / 2,
            ry: height / 2.5,
            originX: 'center',
            originY: 'center',
          });
          break;
        case 'square':
          const size = Math.min(width, height);
          clipPath = new fabric.Rect({
            width: size,
            height: size,
            originX: 'center',
            originY: 'center',
          });
          break;
        case 'rectangle':
          clipPath = new fabric.Rect({
            width: width,
            height: height / 2,
            originX: 'center',
            originY: 'center',
          });
          break;
        default:
          break;
      }

      if (clipPath) {
        img.clipPath = clipPath;
      }
    }

    canvas.renderAll();
  }, [stickerType]);

  // Generate canvas preview image
  const updatePreview = () => {
    if (!canvasInstance.current) return;

    const dataUrl = canvasInstance.current.toDataURL({
      format: 'png',
      quality: 1,
    });

    setCanvasUrl(dataUrl);
  };

  // Update preview when canvas changes
  useEffect(() => {
    const timer = setTimeout(() => {
      updatePreview();
    }, 300);

    return () => clearTimeout(timer);
  }, [borderWidth, borderColor, rotation, stickerType, text, fontFamily, fontSize, fontColor, isBold, isItalic, isUnderline]);

  // Handle save
  const handleSave = () => {
    updatePreview();

    // Use the latest canvas URL
    const dataUrl = canvasInstance.current?.toDataURL({
      format: 'png',
      quality: 1,
    }) || canvasUrl;

    onSave({
      imageId: localProcessedImageId,
      previewUrl: dataUrl,
      rotation,
      borderWidth,
      borderColor,
      text: textRef.current?.text || undefined,
      textProps: textRef.current ? {
        fontFamily,
        fontSize,
        fontColor,
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
      } : undefined,
    });
  };

  // Handle background removal - simulated version without brain dependency
  const handleRemoveBackground = async () => {
    if (!originalImageId) {
      toast.error('Original image not available');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For testing purposes, we'll just use the same image
      // In production, this would be replaced with an actual API call

      // Create a new processedImageId
      const newProcessedImageId = `processed-${Date.now()}`;
      setLocalProcessedImageId(newProcessedImageId);

      toast.success('Background removed successfully');

      // In a real implementation, you would load a new image with the background removed
      // For now, we'll just keep the existing image
      updatePreview();

    } catch (error) {
      console.error('Error removing background:', error);
      toast.error('Failed to remove background. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Get icon for the sticker type
  const getStickerTypeIcon = (type: StickerType) => {
    switch (type) {
      case 'circular':
        return <CircleIcon className="h-5 w-5" />;
      case 'square':
        return <SquareIcon className="h-5 w-5" />;
      case 'rectangle':
        return <RectangleHorizontalIcon className="h-5 w-5" />;
      case 'oval':
        return <Ellipsis className="h-5 w-5" />;
      default:
        return null;
    };
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Canvas & Preview */}
      <div className="col-span-1 lg:col-span-3 space-y-6">
        <PremiumCard>
          <PremiumSectionHeading
            title="Design Canvas"
            description="Customize and position your artwork"
            className="mb-4"
          />
          <div className="relative aspect-square w-full max-w-[500px] max-h-[500px] mx-auto rounded-lg overflow-hidden bg-white border border-border/50 shadow-md">
            <canvas ref={canvasRef} className="absolute inset-0" />
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 backdrop-blur-sm">
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 border-t-2 border-primary/30 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
                  <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
                </div>
              </div>
            )}
          </div>
        </PremiumCard>

        {/* Quick Shape Selection */}
        <PremiumCard className="py-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-shrink-0">
              <PremiumSectionHeading
                title="Quick Shape"
                className="m-0 py-0"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button
                variant={stickerType === 'die-cut' ? "default" : "outline"}
                onClick={() => setStickerType('die-cut')}
                className="h-10 px-3 rounded-lg"
                size="sm"
              >
                Die Cut
              </Button>
              <Button
                variant={stickerType === 'circular' ? "default" : "outline"}
                onClick={() => setStickerType('circular')}
                className="h-10 w-10 p-0 rounded-full"
                size="sm"
              ><Button
                variant={stickerType === 'circular' ? "default" : "outline"}
                onClick={() => setStickerType('circular')}
                className="h-10 w-10 p-0 rounded-full"
                size="sm"
              >
                  <CircleIcon className="h-5 w-5" />
                </Button>
                <Button
                  variant={stickerType === 'square' ? "default" : "outline"}
                  onClick={() => setStickerType('square')}
                  className="h-10 w-10 p-0 rounded-lg"
                  size="sm"
                >
                  <SquareIcon className="h-5 w-5" />
                </Button>
                <Button
                  variant={stickerType === 'rectangle' ? "default" : "outline"}
                  onClick={() => setStickerType('rectangle')}
                  className="h-10 px-3 rounded-lg"
                  size="sm"
                >
                  <RectangleHorizontalIcon className="h-5 w-5" />
                </Button>
                <Button
                  variant={stickerType === 'oval' ? "default" : "outline"}
                  onClick={() => setStickerType('oval')}
                  className="h-10 px-3 rounded-lg"
                  size="sm"
                >
                  <Ellipsis className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={updatePreview}
                  className="h-10 px-3 rounded-lg ml-2 border-dashed"
                  size="sm"
                >
                  Preview
                </Button>
            </div>
          </div>
        </PremiumCard>
      </div>

      {/* Controls Panel */}
      <div className="col-span-1 lg:col-span-2">
        <PremiumCard>
          <PremiumSectionHeading
            title="Design Tools"
            description="Customize your sticker design"
            className="mb-6"
          />

          <Tabs defaultValue="text" className="mb-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <TypeIcon className="h-4 w-4" /> Text
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> Image
              </TabsTrigger>
              <TabsTrigger value="border" className="flex items-center gap-2">
                <PaletteIcon className="h-4 w-4" /> Border
              </TabsTrigger>
            </TabsList>

            {/* Text Tab */}
            <TabsContent value="text" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="text">Text Content</Label>
                  <Input
                    id="text"
                    placeholder="Enter your text here"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="font-medium"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_FAMILIES.map((font) => (
                          <SelectItem key={font} value={font}>
                            <span style={{ fontFamily: font }}>{font}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 w-24">
                    <Label htmlFor="fontSize">Size</Label>
                    <Input
                      type="number"
                      id="fontSize"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      min={8}
                      max={72}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontColor">Text Color</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'].map(color => (
                      <div
                        key={color}
                        className={`h-10 rounded-md border cursor-pointer ${fontColor === color ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFontColor(color)}
                      />
                    ))}
                    <div className="col-span-7 flex items-center space-x-2">
                      <input
                        type="color"
                        id="fontColor"
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        className="flex-1 h-10 rounded-md cursor-pointer"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap"
                        onClick={() => {
                          // Pick a random color that's not too light or dark
                          const randomColor = `#${Math.floor(Math.random() * 0xAAAAAA + 0x555555).toString(16)}`;
                          setFontColor(randomColor);
                        }}
                      >
                        Random
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant={isBold ? "default" : "outline"}
                      onClick={() => setIsBold(!isBold)}
                      className="h-10 w-10 rounded-md"
                    >
                      <BoldIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant={isItalic ? "default" : "outline"}
                      onClick={() => setIsItalic(!isItalic)}
                      className="h-10 w-10 rounded-md"
                    >
                      <ItalicIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant={isUnderline ? "default" : "outline"}
                      onClick={() => setIsUnderline(!isUnderline)}
                      className="h-10 w-10 rounded-md"
                    >
                      <UnderlineIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    onClick={addText}
                    className="px-6"
                    disabled={!text.trim()}
                  >
                    Apply Text
                  </Button>
                </div>

                <div className="p-4 rounded-md bg-muted/50 border border-border mt-4">
                  <p className="text-sm text-muted-foreground">
                    Tip: You can drag and resize your text directly on the canvas once applied.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Image Tab */}
            <TabsContent value="image" className="space-y-4 mt-4">
              {originalImageId && (
                <div className="space-y-4">
                  <Button
                    onClick={handleRemoveBackground}
                    disabled={isProcessing}
                    className="w-full h-12"
                    size="lg"
                  >
                    {isProcessing ? 'Processing...' : 'Remove Background'}
                  </Button>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="rotation" className="mb-2">Rotation</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setRotation(0)}
                      >
                        <RotateCcwIcon className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium">{rotation}°</span>
                    </div>
                  </div>
                  <Slider
                    id="rotation"
                    min={0}
                    max={360}
                    step={1}
                    value={[rotation]}
                    onValueChange={(v) => setRotation(v[0])}
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <div className="p-4 rounded-md bg-muted/50 border border-border mt-2">
                <h4 className="text-sm font-medium mb-1">Sticker Shape</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
                  {[
                    { id: 'die-cut', label: 'Die Cut', icon: <CircleDotIcon className="h-4 w-4" /> },
                    { id: 'kiss-cut', label: 'Kiss Cut', icon: <CircleDotIcon className="h-4 w-4" /> },
                    { id: 'circular', label: 'Circle', icon: <CircleIcon className="h-4 w-4" /> },
                    { id: 'oval', label: 'Oval', icon: <Ellipsis className="h-4 w-4" /> },
                    { id: 'square', label: 'Square', icon: <SquareIcon className="h-4 w-4" /> },
                    { id: 'rectangle', label: 'Rectangle', icon: <RectangleHorizontalIcon className="h-4 w-4" /> },
                    {
                      id: 'sheet', label: 'Sheet', icon: <div className="grid grid-cols-2 gap-px h-4 w-4">
                        <div className="rounded-sm bg-current"></div>
                        <div className="rounded-sm bg-current"></div>
                        <div className="rounded-sm bg-current"></div>
                        <div className="rounded-sm bg-current"></div>
                      </div>
                    }
                  ].map(shape => (
                    <Button
                      key={shape.id}
                      variant={stickerType === shape.id as StickerType ? "default" : "outline"}
                      size="sm"
                      className="h-auto p-2 flex-col gap-1"
                      onClick={() => setStickerType(shape.id as StickerType)}
                    >
                      <span>{shape.icon}</span>
                      <span className="text-[10px]">{shape.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Border Tab */}
            <TabsContent value="border" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="borderWidth" className="mb-2">Border Width</Label>
                    <span className="text-sm font-medium">{borderWidth}px</span>
                  </div>
                  <Slider
                    id="borderWidth"
                    min={0}
                    max={20}
                    step={1}
                    value={[borderWidth]}
                    onValueChange={(v) => setBorderWidth(v[0])}
                    disabled={isProcessing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="borderColor">Border Color</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'].map(color => (
                      <div
                        key={color}
                        className={`h-10 rounded-md border cursor-pointer ${borderColor === color ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setBorderColor(color)}
                      />
                    ))}
                    <input
                      type="color"
                      id="borderColor"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      className="col-span-7 h-10 rounded-md"
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-md bg-muted/50 border border-border mt-4">
                  <p className="text-sm text-muted-foreground">
                    Tip: Border is applied around the edge of your sticker, regardless of its shape.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-12"
              size="lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 h-12"
              size="lg"
            >
              Continue
            </Button>
          </div>
        </PremiumCard>
      </div>
    </div>
        );
}