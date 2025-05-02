// src/app/account/addresses/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function AddressesPage() {
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
        <h1 className="flex-1 text-center text-lg font-semibold">My Addresses</h1>
        <div className="w-9"></div> {/* Spacer */}
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-md space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <MapPin className="h-5 w-5 text-primary" />
                 <span>Saved Addresses</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              <p className="mb-4">Address management is not yet implemented in this version.</p>
              <Button variant="outline" asChild>
                <Link href="/account">Go Back</Link>
              </Button>
              {/* TODO: Implement address adding/editing functionality */}
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
