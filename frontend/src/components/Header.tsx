import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserProfileMenu } from "components/UserProfileMenu";
import { CartIcon } from "components/CartIcon";
import { AuthInitializer } from "components/AuthInitializer";

export interface Props {
  transparent?: boolean;
}

export function Header({ transparent = false }: Props) {
  // Initialize auth on first render
  useEffect(() => {
    // This ensures the authentication is initialized when the app starts
    const init = new AuthInitializer({ children: null });
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine if we're on the home page
  const isHomePage = location.pathname === "/";

  return (
    <header
      className={`w-full py-4 ${
        transparent ? "bg-transparent" : "bg-white shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => navigate("/")}
        >
          <svg
            className="w-8 h-8 text-primary"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 9H9.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 9H15.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="text-xl font-bold text-primary">StickerCraft</h1>
        </div>
        
        <nav>
          <div className="flex items-center space-x-6">
            {isHomePage && (
              <>
                <a
                  href="#features"
                  className="text-gray-700 hover:text-primary transition-colors hidden md:inline"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-700 hover:text-primary transition-colors hidden md:inline"
                >
                  How It Works
                </a>
                <a
                  href="#pricing"
                  className="text-gray-700 hover:text-primary transition-colors hidden md:inline"
                >
                  Pricing
                </a>
              </>
            )}
            
            <button
              onClick={() => navigate("/DesignStudio")}
              className="text-gray-700 hover:text-primary transition-colors hidden md:inline"
            >
              Design Studio
            </button>
            
            <CartIcon />
            <UserProfileMenu />
          </div>
        </nav>
      </div>
    </header>
  );
}
