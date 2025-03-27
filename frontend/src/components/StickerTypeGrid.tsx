import React from 'react';
import { CircleIcon, SquareIcon, RectangleHorizontalIcon, Ellipsis, ScissorsIcon, StickerIcon } from 'lucide-react';
import { CheckIcon } from 'lucide-react';
import { StickerType } from 'utils/cartStore';

export interface Props {
  selectedType: StickerType;
  onChange: (type: StickerType) => void;
}

export function StickerTypeGrid({ selectedType, onChange }: Props) {
  const stickerTypes = [
    {
      id: 'die-cut',
      label: 'Die Cut',
      description: 'Custom shape cut to outline',
      icon: <StickerIcon className="h-8 w-8" />
    },
    {
      id: 'kiss-cut',
      label: 'Kiss Cut',
      description: 'Cut to shape on backing',
      icon: <ScissorsIcon className="h-8 w-8" />
    },
    {
      id: 'circular',
      label: 'Circular',
      description: 'Perfect round shape',
      icon: <CircleIcon className="h-8 w-8" />
    },
    {
      id: 'oval',
      label: 'Oval',
      description: 'Elongated circular shape',
      icon: <Ellipsis className="h-8 w-8" />
    },
    {
      id: 'square',
      label: 'Square',
      description: 'Equal sides, right angles',
      icon: <SquareIcon className="h-8 w-8" />
    },
    {
      id: 'rectangle',
      label: 'Rectangle',
      description: 'Elongated with right angles',
      icon: <RectangleHorizontalIcon className="h-8 w-8" />
    },
    {
      id: 'sheet',
      label: 'Sticker Sheet',
      description: 'Multiple stickers on one sheet',
      icon: <div className="grid grid-cols-2 gap-1 h-8 w-8">
        <div className="rounded-sm bg-current"></div>
        <div className="rounded-sm bg-current"></div>
        <div className="rounded-sm bg-current"></div>
        <div className="rounded-sm bg-current"></div>
      </div>
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {stickerTypes.map(type => (
        <div 
          key={type.id}
          onClick={() => onChange(type.id as StickerType)} 
          className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-200 border ${
            selectedType === type.id 
              ? 'ring-2 ring-primary ring-offset-2 border-primary/20 shadow-md' 
              : 'border-border hover:shadow-md hover:border-primary/10'
          }`}
        >
          <div className="aspect-square bg-gradient-to-b from-muted/80 to-white p-6 flex items-center justify-center text-foreground group-hover:text-primary">
            {type.icon}
          </div>
          <div className="p-3 bg-white border-t border-border">
            <h4 className="text-sm font-medium">{type.label}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
          </div>
          {selectedType === type.id && (
            <div className="absolute top-2 right-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center shadow-md">
              <CheckIcon className="h-3.5 w-3.5 text-white" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
