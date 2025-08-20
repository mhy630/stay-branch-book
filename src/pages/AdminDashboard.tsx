import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BranchManager } from '@/components/admin/BranchManager';
import { ApartmentManager } from '@/components/admin/ApartmentManager';
import { RoomManager } from '@/components/admin/RoomManager';
import { LogOut, Building, Home, DoorOpen } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin, signOut, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button onClick={signOut} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="branches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="branches" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Branches
            </TabsTrigger>
            <TabsTrigger value="apartments" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Apartments
            </TabsTrigger>
            <TabsTrigger value="rooms" className="flex items-center gap-2">
              <DoorOpen className="h-4 w-4" />
              Rooms
            </TabsTrigger>
          </TabsList>

          <TabsContent value="branches">
            <BranchManager />
          </TabsContent>

          <TabsContent value="apartments">
            <ApartmentManager />
          </TabsContent>

          <TabsContent value="rooms">
            <RoomManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}