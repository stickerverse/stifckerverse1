import React from 'react';

export interface Props {
  title: string;
  description?: string;
  className?: string;
}

export function PremiumSectionHeading({ title, description, className = '' }: Props) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-1.5 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
