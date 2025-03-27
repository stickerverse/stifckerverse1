import React from 'react';

export interface Props {
  children: React.ReactNode;
  className?: string;
}

export function PremiumCard({ children, className = '' }: Props) {
  return (
    <div className={`bg-white rounded-xl border border-border/40 shadow-lg shadow-black/[0.03] p-6 md:p-8 ${className}`}>
      {children}
    </div>
  );
}
