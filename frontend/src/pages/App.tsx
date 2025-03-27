import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "components/Header";
import { FeatureCard } from "components/FeatureCard";
import { StepCard } from "components/StepCard";
import { Footer } from "components/Footer";
import { AppContainer } from "components/AppContainer";
import { toast } from "sonner";

export default function App() {
  const navigate = useNavigate();

  return (
    <AppContainer>
      <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-blue-50 py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Transform Your Artwork into Amazing Stickers
            </h1>
            <p className="text-lg mb-8 text-gray-700">
              Upload, customize, and order high-quality custom stickers in minutes. 
              Choose from different shapes, sizes, and materials for the perfect look.
            </p>
            <button 
              onClick={() => navigate("/DesignStudio")} 
              className="bg-primary text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              Start Designing Now
            </button>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute top-4 right-4 bg-white bg-opacity-70 py-1 px-3 rounded-md text-sm font-medium hover:bg-opacity-90 transition-all cursor-pointer" onClick={() => {
              toast.info('Admin demo: admin@admin.com / adminpass');
            }}>
              <span className="text-blue-600">Demo admin access</span>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-64 h-64 bg-blue-100 rounded-lg transform -rotate-6"></div>
              <div className="absolute -bottom-4 -right-4 w-64 h-64 bg-purple-100 rounded-lg transform rotate-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1614032686163-bdc24c13d0b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                alt="Sticker designs" 
                className="rounded-lg shadow-lg relative z-10 w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose StickerCraft?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our easy-to-use platform gives you all the tools you need to create 
              professional custom stickers without the hassle.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              } 
              title="Easy Image Upload"
              description="Simply upload your artwork, and our system will help you transform it into sticker-ready designs in seconds."
            />
            
            <FeatureCard 
              icon={
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              } 
              title="Powerful Customization"
              description="Add text, adjust colors, apply background removal, and choose from various styles to make your stickers truly unique."
            />
            
            <FeatureCard 
              icon={
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              } 
              title="Multiple Sticker Types"
              description="Choose from die-cut, kiss-cut, circular, oval, square, rectangle, or sticker sheets to fit your specific needs."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Creating your perfect custom stickers is quick and easy with our 
              streamlined design process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <StepCard 
              number={1}
              title="Upload Your Design"
              description="Upload your artwork or create a design directly in our easy-to-use editor."
              image="https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2136&q=80"
            />
            
            <StepCard 
              number={2}
              title="Customize Your Stickers"
              description="Choose sticker type, add text, adjust colors, and preview your design."
              image="https://images.unsplash.com/photo-1611532736579-6b16e2b50458?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80"
            />
            
            <StepCard 
              number={3}
              title="Order & Enjoy"
              description="Select quantity, material finish, and place your order. We'll deliver it to your door."
              image="https://images.unsplash.com/photo-1566888596782-c7f41cc184c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            />
          </div>
        </div>
      </section>

      {/* Sticker Types Showcase */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sticker Types</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from a variety of sticker options to perfectly match your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 text-center">
              <div className="bg-gray-100 rounded-lg p-6 mb-3 aspect-square flex items-center justify-center">
                <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="font-semibold">Die Cut</h3>
            </div>
            
            <div className="p-4 text-center">
              <div className="bg-gray-100 rounded-lg p-6 mb-3 aspect-square flex items-center justify-center">
                <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="7" strokeWidth="2" />
                  <circle cx="12" cy="12" r="11" strokeWidth="2" strokeDasharray="1 3" />
                </svg>
              </div>
              <h3 className="font-semibold">Kiss Cut</h3>
            </div>
            
            <div className="p-4 text-center">
              <div className="bg-gray-100 rounded-lg p-6 mb-3 aspect-square flex items-center justify-center">
                <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="font-semibold">Circular</h3>
            </div>
            
            <div className="p-4 text-center">
              <div className="bg-gray-100 rounded-lg p-6 mb-3 aspect-square flex items-center justify-center">
                <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <ellipse cx="12" cy="12" rx="8" ry="10" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="font-semibold">Oval</h3>
            </div>
            
            <div className="p-4 text-center">
              <div className="bg-gray-100 rounded-lg p-6 mb-3 aspect-square flex items-center justify-center">
                <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="4" y="4" width="16" height="16" rx="1" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="font-semibold">Square</h3>
            </div>
            
            <div className="p-4 text-center">
              <div className="bg-gray-100 rounded-lg p-6 mb-3 aspect-square flex items-center justify-center">
                <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="2" y="6" width="20" height="12" rx="1" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="font-semibold">Rectangle</h3>
            </div>
            
            <div className="p-4 text-center">
              <div className="bg-gray-100 rounded-lg p-6 mb-3 aspect-square flex items-center justify-center">
                <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="1" strokeWidth="2" />
                  <line x1="3" y1="9" x2="21" y2="9" strokeWidth="1" />
                  <line x1="3" y1="15" x2="21" y2="15" strokeWidth="1" />
                  <line x1="9" y1="3" x2="9" y2="21" strokeWidth="1" />
                  <line x1="15" y1="3" x2="15" y2="21" strokeWidth="1" />
                </svg>
              </div>
              <h3 className="font-semibold">Sticker Sheets</h3>
            </div>
            
            <div className="p-4 text-center">
              <div className="bg-gray-100 rounded-lg p-6 mb-3 aspect-square flex items-center justify-center">
                <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-semibold">Custom Shapes</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Premium Materials</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our stickers are made with high-quality vinyl that's waterproof, 
              scratch-resistant, and built to last.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="h-48 bg-gradient-to-r from-blue-100 to-blue-200 rounded-md mb-4 flex items-center justify-center">
                <span className="text-primary font-semibold">Glossy Finish</span>
              </div>
              <h3 className="font-semibold mb-2">Glossy Vinyl</h3>
              <p className="text-gray-600">Vibrant colors with a shiny finish. Perfect for bright, eye-catching stickers.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md mb-4 flex items-center justify-center">
                <span className="text-primary font-semibold">Matte Finish</span>
              </div>
              <h3 className="font-semibold mb-2">Matte Vinyl</h3>
              <p className="text-gray-600">Elegant, non-reflective finish. Ideal for a more sophisticated, premium look.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="h-48 bg-gradient-to-r from-purple-100 to-pink-100 rounded-md mb-4 flex items-center justify-center">
                <span className="text-primary font-semibold">Holographic</span>
              </div>
              <h3 className="font-semibold mb-2">Holographic Vinyl</h3>
              <p className="text-gray-600">Eye-catching rainbow effect that shifts colors as light hits it from different angles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Create Your Custom Stickers?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Turn your artwork into high-quality stickers today and bring your creativity to life.
          </p>
          <button 
            onClick={() => navigate("/DesignStudio")} 
            className="bg-white text-primary px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors shadow-sm"
          >
            Start Designing Now
          </button>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Affordable prices for high-quality custom stickers, with discounts for larger quantities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
              <div className="mb-4">
                <h3 className="font-bold text-xl mb-2">Small Batch</h3>
                <p className="text-gray-600 text-sm">Perfect for testing or small projects</p>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">$12</span>
                <span className="text-gray-600 ml-1">starting price</span>
              </div>
              
              <ul className="space-y-2 mb-8 flex-grow">
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  5-25 stickers
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All shapes available
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Glossy, Matte, or Holographic
                </li>
              </ul>
              
              <button className="bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors">
                Select Option
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-primary flex flex-col relative">
              <div className="absolute -top-3 left-0 right-0 flex justify-center">
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
              
              <div className="mb-4">
                <h3 className="font-bold text-xl mb-2">Medium Batch</h3>
                <p className="text-gray-600 text-sm">Great for promotional events</p>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">$25</span>
                <span className="text-gray-600 ml-1">starting price</span>
              </div>
              
              <ul className="space-y-2 mb-8 flex-grow">
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  25-100 stickers
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All shapes available
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Glossy, Matte, or Holographic
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  10% discount applied
                </li>
              </ul>
              
              <button className="bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors">
                Select Option
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
              <div className="mb-4">
                <h3 className="font-bold text-xl mb-2">Bulk Order</h3>
                <p className="text-gray-600 text-sm">Best value for larger campaigns</p>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">$75</span>
                <span className="text-gray-600 ml-1">starting price</span>
              </div>
              
              <ul className="space-y-2 mb-8 flex-grow">
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  100-1000 stickers
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All shapes available
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Glossy, Matte, or Holographic
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  25% discount applied
                </li>
                <li className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority shipping
                </li>
              </ul>
              
              <button className="bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors">
                Select Option
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      </div>
    </AppContainer>
  );
}
