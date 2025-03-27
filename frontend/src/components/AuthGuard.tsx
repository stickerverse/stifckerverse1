import React from 'react';
import { UserGuard as FirebaseUserGuard } from 'app/auth';

export interface Props {
  children: React.ReactNode;
}

// Use the UserGuard from the Firebase extension
export function AuthGuard({ children }: Props) {
  return <FirebaseUserGuard>{children}</FirebaseUserGuard>;
}
