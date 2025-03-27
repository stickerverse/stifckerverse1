import { useEffect } from 'react';

// AuthInitializer is no longer needed as the firebase authentication is initialized by the app/auth module

export interface Props {
  children: React.ReactNode;
}

export function AuthInitializer({ children }: Props) {
  // This component is kept for backwards compatibility but doesn't do anything anymore
  return <>{children}</>;
}
