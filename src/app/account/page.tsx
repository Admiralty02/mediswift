// src/app/account/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, MapPin, Bell, ChevronRight, History, Home, FileText, ShoppingBasket } from 'lucide-react'; // Added History, Home, FileText, ShoppingBasket
import { Card, CardContent } from '@/components/ui/card';
import LogoutButton from '@/components/LogoutButton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function AccountPage() {
  // Mock user data - replace with actual user data from auth/context
  const user = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    avatarUrl: "https://picsum.photos/seed/avatar1/100/100"
  };

  // Simplified options for MVP
  const accountOptions = [
    { label: "Order History", icon: History, href: "/account/orders" }, // Link to order history
    { label: "Personal Information", icon: User, href: "/account/profile" },
    { label: "Addresses", icon: MapPin, href: "/account/addresses" },
    // { label: "Notifications", icon: Bell, href: "/account/notifications" }, // Removed for MVP simplicity
  ];

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
        <h1 className="flex-1 text-center text-lg font-semibold">My Account</h1>
        <div className="w-9"></div> {/* Spacer */}
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20"> {/* Added pb-20 */}
        <div className="mx-auto max-w-md space-y-6">
          {/* User Info Card */}
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <Avatar className="h-16 w-16 border">
                 <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user profile avatar"/>
                 <AvatarFallback>{user.name?.charAt(0)?.toUpperCase() ?? 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                 {/* Optional: Edit Profile Link */}
                 {/* <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                    <Link href="/account/profile">Edit Profile</Link>
                </Button> */}
              </div>
            </CardContent>
          </Card>

          {/* Account Options */}
          <Card>
             <CardContent className="p-0">
               <ul className="divide-y divide-border">
                 {accountOptions.map((option) => (
                   <li key={option.label}>
                     <Link href={option.href} className="flex items-center justify-between p-4 hover:bg-secondary/50 active:bg-secondary/70 transition-colors">
                        <div className="flex items-center gap-3">
                            <option.icon className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm font-medium">{option.label}</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                     </Link>
                   </li>
                 ))}
               </ul>
            </CardContent>
          </Card>

          {/* Logout Button */}
          <LogoutButton/>
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
             <Link href="/cart" className="flex flex-col items-center justify-center gap-1 p-2 text-muted-foreground hover:text-primary">
                <ShoppingBasket className="h-5 w-5" />
                <span className="text-xs">Cart</span>
             </Link>
             <Link href="/account" className="flex flex-col items-center justify-center gap-1 p-2 text-primary" aria-current="page">
               <User className="h-5 w-5" />
               <span className="text-xs font-medium">Account</span>
             </Link>
         </nav>
      </footer>
    </div>
  );
}
