import React from 'react';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { AppContainer } from 'components/AppContainer';
import { SignInOrUpForm } from 'app/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  
  return (
    <AppContainer>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
            
            <SignInOrUpForm 
              signInOptions={{
                emailAndPassword: true,
                google: true
              }}
            />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button 
                  onClick={() => navigate('/register')} 
                  className="text-primary hover:text-primary/90 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AppContainer>
  );
}
