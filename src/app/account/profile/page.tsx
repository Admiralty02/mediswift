// src/app/account/profile/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User } from 'lucide-react';

export default function ProfilePage() {
   // Mock user data for display (replace with actual data later)
   const user = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+254 7XX XXX XXX" // Example phone
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/account">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Account</span>
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-lg font-semibold">Personal Information</h1>
        <div className="w-9"></div> {/* Spacer */}
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-md space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <User className="h-5 w-5 text-primary" />
                 <span>Profile Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <p>{user.name}</p>
               </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                    <p>{user.email}</p>
               </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                    <p>{user.phone}</p>
               </div>
               <Button variant="outline" className="w-full" disabled>
                    Edit Profile (Coming Soon)
               </Button>
               {/* TODO: Implement profile editing form */}
            </CardContent>
          </Card>
        </div>
      </main>

       {/* Footer */}
       <footer className="border-t bg-secondary py-4 px-4 md:px-6 mt-auto">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MediSwift. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
