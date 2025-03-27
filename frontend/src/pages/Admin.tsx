import React, { useState, useEffect } from 'react';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { AppContainer } from 'components/AppContainer';
import { useCurrentUser } from 'app/auth';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { firebaseApp } from 'app';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt?: any;
}

interface Order {
  id: string;
  userId: string;
  status: string;
  amount: number;
  items: any[];
  createdAt?: any;
}

export default function Admin() {
  const { user, loading } = useCurrentUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("users");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });
  const [salesData, setSalesData] = useState<{name: string, value: number}[]>([]);

  // Check if user is admin (for demo purposes) 
  const isAdmin = user?.email === 'admin@admin.com';

  // Redirect if not admin
  useEffect(() => {
    if (!loading && user && !isAdmin) {
      toast.error('You do not have permission to access the admin area');
      navigate('/');
    }
  }, [user, isAdmin, navigate, loading]);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !isAdmin) return;
      
      try {
        // Generate mock data for demo
        const mockUsers = [
          { id: '1', email: 'admin@admin.com', displayName: 'Admin User' },
          { id: '2', email: 'user1@example.com', displayName: 'Regular User 1' },
          { id: '3', email: 'user2@example.com', displayName: 'Regular User 2' },
          { id: '4', email: 'user3@example.com', displayName: 'Regular User 3' },
        ];
        
        const mockOrders = [
          { id: '1', userId: '2', status: 'completed', amount: 25.99, items: [{ name: 'Die Cut Stickers', quantity: 10 }], createdAt: new Date(2023, 5, 10) },
          { id: '2', userId: '3', status: 'processing', amount: 34.50, items: [{ name: 'Holographic Stickers', quantity: 15 }], createdAt: new Date(2023, 5, 15) },
          { id: '3', userId: '2', status: 'completed', amount: 19.99, items: [{ name: 'Matte Stickers', quantity: 8 }], createdAt: new Date(2023, 6, 2) },
          { id: '4', userId: '4', status: 'completed', amount: 45.75, items: [{ name: 'Sticker Sheet', quantity: 5 }], createdAt: new Date(2023, 6, 10) },
        ];
        
        setUsers(mockUsers);
        setOrders(mockOrders);
        
        // Calculate stats
        const totalRevenue = mockOrders.reduce((sum, order) => sum + order.amount, 0);
        
        setStats({
          totalUsers: mockUsers.length,
          totalOrders: mockOrders.length,
          totalRevenue: totalRevenue,
          averageOrderValue: totalRevenue / mockOrders.length
        });
        
        // Create sales data per month (mock data)
        const mockSalesData = [
          { name: 'Jan', value: 400 },
          { name: 'Feb', value: 300 },
          { name: 'Mar', value: 600 },
          { name: 'Apr', value: 800 },
          { name: 'May', value: 700 },
          { name: 'Jun', value: 900 },
        ];
        
        setSalesData(mockSalesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, isAdmin]);

  const handleDeleteUser = async (userId: string) => {
    // This would delete the user in a real implementation
    toast.success('User deleted successfully');
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    // This would update the order status in a real implementation
    toast.success(`Order status updated to ${newStatus}`);
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    }));
  };

  if (!user || loading) {
    return (
      <>
        <Header />
        <AppContainer>
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-lg">Loading admin dashboard...</p>
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
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.averageOrderValue.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Monthly sales data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs */}
          <Tabs defaultValue="users">
            <TabsList className="mb-4">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="design">Design Elements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage users</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map(user => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.displayName}</TableCell>
                          <TableCell>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.email === 'admin@admin.com'} // Prevent deleting admin
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>View and manage orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map(order => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.userId}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell>${order.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                disabled={order.status === 'completed'}
                              >
                                Mark Completed
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                                disabled={order.status === 'processing'}
                              >
                                Mark Processing
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="design" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Design Element Management</CardTitle>
                  <CardDescription>Update website design elements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Primary Color</label>
                        <div className="flex items-center gap-2">
                          <input type="color" value="#3b82f6" className="h-10 w-20" />
                          <Button size="sm">Update</Button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Secondary Color</label>
                        <div className="flex items-center gap-2">
                          <input type="color" value="#10b981" className="h-10 w-20" />
                          <Button size="sm">Update</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Logo</label>
                      <div className="flex items-center gap-2">
                        <input type="file" className="text-sm" />
                        <Button size="sm">Upload</Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Banner Text</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value="Welcome to StickerCraft - Custom Stickers for Every Need!"
                      />
                      <div className="mt-2">
                        <Button size="sm">Update</Button>
                      </div>
                    </div>
                  </div>
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
