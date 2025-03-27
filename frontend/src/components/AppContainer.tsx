import React from 'react';
import { Toaster } from 'sonner';
import { AuthInitializer } from './AuthInitializer';

export interface Props {
  children: React.ReactNode;
}

export function AppContainer({ children }: Props) {
  return (
    <AuthInitializer>
      {children}
      <Toaster position="top-right" richColors />
    </AuthInitializer>
  );
}
