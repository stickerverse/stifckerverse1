import React from "react";

export interface Props {
  number: number;
  title: string;
  description: string;
  image: string;
}

export function StepCard({ number, title, description, image }: Props) {
  return (
    <div className="flex flex-col items-center max-w-sm mx-auto">
      <div className="relative w-64 h-64 mb-6 rounded-lg overflow-hidden shadow-md">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
          {number}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
}
