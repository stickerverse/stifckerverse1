import React, { useState } from 'react';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { useCurrentUser } from 'app/auth';
import { AuthGuard } from 'components/AuthGuard';
import { AppContainer } from 'components/AppContainer';
import { toast } from 'sonner';
import { updateProfile } from 'firebase/auth';

export default function Profile() {
  const { user, loading } = useCurrentUser();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      await updateProfile(user, {
        displayName: displayName
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppContainer>
      <AuthGuard>
        <div className="min-h-screen flex flex-col">
          <Header />
          
          <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
            
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl mr-4">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{displayName || 'User'}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <button
                type="submit"
                disabled={isSaving}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">Saving</span>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </form>
          </div>
        </main>
        
        <Footer />
        </div>
      </AuthGuard>
    </AppContainer>
  );
}
