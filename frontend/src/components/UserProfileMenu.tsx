import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { auth } from 'app/auth';
import { useCurrentUser } from 'app/auth';
import { User } from 'firebase/auth';
import { Menu, X } from 'lucide-react';

export function UserProfileMenu() {
  const { user, loading } = useCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is admin (for demo purposes) 
  const isAdmin = user?.email === 'admin@admin.com';

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-10 w-10">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/login')}
          className="text-gray-700 hover:text-primary transition-colors"
        >
          Sign In
        </button>
        <button
          onClick={() => navigate('/login?register=true')}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
          {user.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="text-gray-700">{user.email?.split('@')[0]}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button
            onClick={() => {
              navigate('/user-profile');
              setIsMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile
          </button>
          {isAdmin && (
            <button
              onClick={() => {
                navigate('/admin');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Admin Dashboard
            </button>
          )}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
