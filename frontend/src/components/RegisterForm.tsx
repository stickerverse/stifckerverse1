import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { firebaseAuth, firebaseApp } from 'app/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      toast.error('Password should be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      
      // Set a default display name based on email
      if (userCredential.user) {
        const displayName = email.split('@')[0];
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
        
        // Create a user profile document in Firestore
        const db = getFirestore(firebaseApp);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: email,
          displayName: displayName,
          createdAt: new Date().toISOString(),
          orders: []
        });
      }
      
      toast.success('Account created successfully!');
      navigate('/design-studio');
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register');
      toast.error(error.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="youremail@example.com"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="********"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="********"
          />
        </div>
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="mr-2">Creating account</span>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            </span>
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary/90 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
