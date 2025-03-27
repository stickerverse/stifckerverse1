import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContainer } from 'components/AppContainer';
import { useCartStore, StickerType, StickerMaterial } from 'utils/cartStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useCurrentUser } from 'app/auth';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, clearCart, getTotalPrice } = useCartStore();
  const { user, loading } = useCurrentUser();
  
  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast.success('Item removed from cart');
  };
  
  const handleCheckout = () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      toast.info('Please sign in to complete your purchase');
      navigate('/login');
      return;
    }
    
    // Will be implemented with Stripe integration
    toast.success('Proceeding to checkout...');
    // For now, just clear the cart and show a success message
    clearCart();
    toast.success('Order placed successfully!');
    navigate('/');
  };
  
  return (
    <AppContainer>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {items.length === 0 ? (
          <Card className="p-8 text-center">
            <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any stickers to your cart yet.</p>
            <Button onClick={() => navigate('/design-studio')}>
              Design a Sticker
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Items</h2>
              
              {items.map((item) => (
                <Card key={item.id} className="mb-4 overflow-hidden">
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row">
                      <div className="h-40 w-40 rounded-md overflow-hidden mr-6 flex-shrink-0 mx-auto sm:mx-0 mb-4 sm:mb-0">
                        <img 
                          src={item.previewUrl}
                          alt={`${item.stickerType} sticker`}
                          className="h-full w-full object-contain"
                        />
                        {item.text && (
                          <div className="absolute text-center">
                            <p
                              style={{
                                fontFamily: item.textProps?.fontFamily || 'Arial',
                                fontSize: `${item.textProps?.fontSize || 16}px`,
                                color: item.textProps?.fontColor || '#000',
                                fontWeight: item.textProps?.bold ? 'bold' : 'normal',
                                fontStyle: item.textProps?.italic ? 'italic' : 'normal',
                                textDecoration: item.textProps?.underline ? 'underline' : 'none',
                              }}
                            >
                              {item.text}
                            </p>
                          </div>
                        )}
                      </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium text-lg capitalize">{item.stickerType.replace('-', ' ')} Stickers</h3>
                        <span className="font-semibold">${item.price.toFixed(2)}</span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-500 mb-4">
                        <p>Material: <span className="capitalize">{item.material}</span> vinyl</p>
                        <p>Quantity: {item.quantity} stickers</p>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="col-span-1">
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <Separator className="mb-4" />
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
                
                <Separator className="mb-4" />
                
                <div className="flex justify-between font-semibold text-lg mb-6">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleCheckout} 
                    className="w-full" 
                    size="lg"
                  >
                    {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/design-studio')} 
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AppContainer>
  );
}
