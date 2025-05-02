// src/app/cart/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBasket, FileText, Home, User } from 'lucide-react'; // Added nav icons
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CartPage() {
  // MVP focuses on prescription orders, so cart functionality is minimal for now.
  const mockCartItems: any[] = []; // Keep cart empty for MVP

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4">
         <Button variant="ghost" size="icon" asChild>
          {/* Link back to home */}
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-lg font-semibold">My Cart</h1>
        <div className="w-9"></div> {/* Spacer */}
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20"> {/* Added pb-20 */}
        <div className="mx-auto max-w-md space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Shopping Cart</CardTitle>
                 </CardHeader>
              <CardContent className="p-6 text-center">
                <ShoppingBasket className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                    Your shopping cart is currently empty.
                    For prescription orders, please use the upload feature.
                </p>
                <Button asChild className="mt-4">
                    <Link href="/upload-prescription">Upload Prescription</Link>
                </Button>
                 <Button asChild variant="outline" className="mt-2 w-full">
                    <Link href="/">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
        </div>
      </main>

       {/* Bottom Navigation */}
       <footer className="sticky bottom-0 z-50 border-t bg-background">
         <nav className="flex justify-around items-center h-16">
            <Link href="/" className="flex flex-col items-center justify-center gap-1 p-2 text-muted-foreground hover:text-primary">
               <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Link>
             <Link href="/upload-prescription" className="flex flex-col items-center justify-center gap-1 p-2 text-muted-foreground hover:text-primary">
                <FileText className="h-5 w-5" />
                <span className="text-xs">Prescription</span>
             </Link>
             <Link href="/cart" className="flex flex-col items-center justify-center gap-1 p-2 text-primary" aria-current="page">
                <ShoppingBasket className="h-5 w-5" />
                <span className="text-xs font-medium">Cart</span>
             </Link>
             <Link href="/account" className="flex flex-col items-center justify-center gap-1 p-2 text-muted-foreground hover:text-primary">
               <User className="h-5 w-5" />
               <span className="text-xs">Account</span>
             </Link>
         </nav>
      </footer>
    </div>
  );
}
