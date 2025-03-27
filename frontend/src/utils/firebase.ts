import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, updateProfile } from 'firebase/auth';
import { create } from 'zustand';

// Import Firebase components from our custom config
import { auth } from './firebaseConfig';

// Auth functions
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Set a default display name based on email
    if (userCredential.user) {
      const displayName = email.split('@')[0];
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }
    return userCredential;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Zustand store for auth state
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  initialized: false,
  isAdmin: false,
  setUser: (user) => set({ 
    user, 
    isAdmin: user?.email?.endsWith('@admin.com') || false 
  }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setInitialized: (initialized) => set({ initialized }),
}));

// Initialize auth listener
export const initializeAuth = () => {
  const { setUser, setLoading, setInitialized } = useAuthStore.getState();
  
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setUser(user);
    setLoading(false);
    setInitialized(true);
    
    // Also store user info in localStorage for persistence
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isAdmin: user.email?.endsWith('@admin.com') || false // Simple admin check
      }));
    } else {
      localStorage.removeItem('currentUser');
    }
  });
  
  return unsubscribe;
};

// Check if user is admin
export const isUserAdmin = (user: User | null): boolean => {
  return !!user?.email?.endsWith('@admin.com');
};

// Export auth instance
export { auth };
