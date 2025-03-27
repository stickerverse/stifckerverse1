import React, { useState, useEffect } from 'react';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { AppContainer } from 'components/AppContainer';
import { useCurrentUser } from 'app/auth';
import { firebaseAuth } from 'app/auth';
import { toast } from 'sonner';
import { updateProfile } from 'firebase/auth';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';

// Define interfaces
interface Order {
  id: string;
  date: string;
  status: string;
  items: string[];
  total: number;
}

export default function UserProfile() {
  const { user, loading } = useCurrentUser();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  // Load mock orders for demo purposes
  useEffect(() => {
    if (user) {
      // In a real app, this would fetch from Firestore
      const mockOrders: Order[] = [
        {
          id: '1001',
          date: '2023-03-15',
          status: 'Delivered',
          items: ['Custom Die-Cut Sticker Pack (10)'],
          total: 24.99
        },
        {
          id: '1002',
          date: '2023-02-28',
          status: 'Shipped',
          items: ['Holographic Circle Stickers (50)'],
          total: 45.50
        },
        {
          id: '1003',
          date: '2023-01-12',
          status: 'Delivered',
          items: ['Matte Rectangle Stickers (25)', 'Glossy Circle Stickers (15)'],
          total: 32.75
        }
      ];
      
      setOrders(mockOrders);
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
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

  if (loading) {
    return (
      <>
        <Header />
        <AppContainer>
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-lg">Loading profile...</p>
          </div>
        </AppContainer>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <AppContainer>
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-lg">Please log in to view your profile</p>
          </div>
        </AppContainer>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <AppContainer>
        <div className="py-10">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Update your account settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="displayName" className="text-sm font-medium">Name</label>
                      <input
                        type="text"
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        disabled
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                      <p className="text-sm text-gray-500">Email cannot be changed</p>
                    </div>
                    
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your password and account security</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={() => {
                    // In a real app, this would send a password reset email
                    toast.success('Password reset email sent!');
                  }}>
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View your past orders and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order #</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell>{order.items.join(', ')}</TableCell>
                            <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">You haven't placed any orders yet.</p>
                      <Button className="mt-4" onClick={() => navigate('/design-studio')}>
                        Create Your First Sticker
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AppContainer>
      <Footer />
    </>
  );
}