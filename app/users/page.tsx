"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Settings, Clock } from 'lucide-react';

export default function UsersPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage users and their access to the inventory system
            </p>
          </div>
          <Badge variant="secondary" className="gap-2">
            <Clock className="w-4 h-4" />
            Coming Soon
          </Badge>
        </div>

        {/* Coming Soon Card */}
        <Card className="text-center py-12">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">User Management Coming Soon</CardTitle>
            <CardDescription className="text-lg mt-2">
              We're working on comprehensive user management features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="p-4 border rounded-lg">
                <UserPlus className="w-6 h-6 text-blue-600 mb-2" />
                <h3 className="font-medium mb-1">User Registration</h3>
                <p className="text-sm text-muted-foreground">
                  Add and manage team members with different access levels
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <Settings className="w-6 h-6 text-blue-600 mb-2" />
                <h3 className="font-medium mb-1">Role Management</h3>
                <p className="text-sm text-muted-foreground">
                  Configure permissions and roles for different user types
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">
                This feature will include:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• User registration and authentication</li>
                <li>• Role-based access control</li>
                <li>• Activity tracking and audit logs</li>
                <li>• Team collaboration features</li>
              </ul>
            </div>
            <Button disabled className="gap-2">
              <UserPlus className="w-4 h-4" />
              Add User (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}