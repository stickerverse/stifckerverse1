import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "components/Header";
import { Footer } from "components/Footer";
import { AuthGuard } from "components/AuthGuard";
import { AppContainer } from "components/AppContainer";

export default function Design() {
  const navigate = useNavigate();

  return (
    <AppContainer>
      <AuthGuard>
        <div className="min-h-screen flex flex-col">
          <Header />
          
          <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="text-center p-8 max-w-md">
              <h1 className="text-2xl font-bold mb-4">Coming Soon</h1>
              <p className="mb-6 text-gray-600">
                The sticker design feature is under development. Check back soon!
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </main>
          
          <Footer />
        </div>
      </AuthGuard>
    </AppContainer>
  );
}
