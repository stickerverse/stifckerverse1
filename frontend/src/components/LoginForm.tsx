import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth, useCurrentUser, firebaseAuth, firebaseApp } from "app/auth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export function LoginForm() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, loading } = useCurrentUser();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/design-studio');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // If URL contains ?register=true, switch to register tab
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('register') === 'true') {
      setActiveTab("register");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Handle admin demo login
      if (loginEmail === 'admin@admin.com' && loginPassword === 'adminpass') {
        // This is just for demo purposes - in a real app, admin would be determined by roles in the database
        toast.success('Logged in as administrator');
        navigate('/admin');
        return;
      }
      
      await signInWithEmailAndPassword(firebaseAuth, loginEmail, loginPassword);
      toast.success('Login successful!');
      navigate('/design-studio');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login');
      toast.error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate password match
    if (registerPassword !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    // Validate password strength
    if (registerPassword.length < 6) {
      setError('Password should be at least 6 characters');
      toast.error('Password should be at least 6 characters');
      return;
    }
    
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, registerEmail, registerPassword);
      
      // Set a default display name based on email
      if (userCredential.user) {
        const displayName = registerEmail.split('@')[0];
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
        
        // Create a user profile document in Firestore
        const db = getFirestore(firebaseApp);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: registerEmail,
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
    <Card className="w-full max-w-md mx-auto">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="login">Sign In</TabsTrigger>
          <TabsTrigger value="register">Create Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
          <form onSubmit={handleLogin}>
            {error && activeTab === "login" && (
              <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="youremail@example.com"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
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
                  <span className="mr-2">Signing in</span>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => setActiveTab("register")} 
                className="text-primary hover:text-primary/90 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="register" className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="youremail@example.com"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="register-password"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="********"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
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
              <button 
                type="button"
                onClick={() => setActiveTab("login")} 
                className="text-primary hover:text-primary/90 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
