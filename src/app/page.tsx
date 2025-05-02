'use client';

// src/app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card'; // Removed unused Header, Title
import { Input } from '@/components/ui/input';
import { Search, User, Pill, ShoppingBasket, ChevronRight, FileText, Home } from 'lucide-react'; // Added Home icon
import { getProducts, type Product } from '@/services/pharmacy';
import TopRatedProductsList from '@/components/TopRatedProductsList';
import {useRouter} from 'next/navigation';

// Mock data for categories - replace with dynamic data later
const categories = [
  { name: 'Medicines', icon: Pill, href: '/products?category=medicines', badge: 0 },
  { name: 'Health Essentials', icon: ShoppingBasket, href: '/products?category=essentials', badge: 0 }, // Example badge removed
];

// Client Component to handle search input click
function SearchInput() {
  const router = useRouter();

  const handleSearchClick = () => {
    // TODO: Implement Search Page
    alert('Search functionality not implemented yet.');
     router.push('/search'); // programmatically redirect
  };

  return (
    <Input
      type="search"
      placeholder="Search medicines..."
      className="pl-9"
      readOnly
      onClick={handleSearchClick}
    />
  );
}

// Fetch top-rated products on the server
async function getTopRatedProducts(): Promise<Product[]> {
  try {
    const allProducts = await getProducts();
    // Simple mock logic: filter products with rating >= 4.5 and take top 2 based on rating
    return allProducts
      .filter(p => p.rating && p.rating >= 4.7) // Example threshold
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)) // Sort descending by rating
      .slice(0, 3); // Take top 3
  } catch (error) {
    console.error("Failed to fetch top rated products:", error);
    return []; // Return empty array on error
  }
}

export default async function HomePage() {
  // Fetching only the data needed for the top rated list
  const topRatedProductsData: Product[] = await getTopRatedProducts();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4">
        <h1 className="text-xl font-bold text-primary">MediSwift</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
             <Link href="/search"> {/* TODO: Implement Search Page */}
                 <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
             <Link href="/account">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-20"> {/* Added pb-20 for bottom nav space */}
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
           {/* TODO: Make search functional or link to search page */}
            <SearchInput/>
        </div>

        {/* Categories */}
        <section aria-labelledby="categories-title" className="mb-6">
            <h2 id="categories-title" className="sr-only">Categories</h2>
             <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                    <Link href={category.href} key={category.name} className="block">
                    <Card className="relative flex h-24 items-center justify-center bg-card p-4 text-center transition-shadow hover:shadow-md active:scale-95">
                        <div className="flex flex-col items-center gap-2">
                        <category.icon className="h-6 w-6 text-primary" />
                        <p className="text-sm font-medium text-card-foreground">{category.name}</p>
                        </div>
                        {category.badge > 0 && (
                        <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            {category.badge}
                        </div>
                        )}
                    </Card>
                    </Link>
                ))}
             </div>
        </section>

        {/* Upload Prescription */}
        <section aria-labelledby="upload-prescription-title" className="mb-6">
            <h2 id="upload-prescription-title" className="sr-only">Upload Prescription</h2>
           <Link href="/upload-prescription" className="block">
             <Card className="flex items-center justify-between p-4 transition-colors hover:bg-secondary/50 active:bg-secondary/70">
                <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                        <p className="font-semibold text-foreground">Upload Prescription</p>
                        <p className="text-xs text-muted-foreground">Order via prescription photo</p>
                    </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
             </Card>
            </Link>
        </section>

         {/* Top Rated Products */}
        <section aria-labelledby="top-rated-title">
            <div className="mb-2 flex items-center justify-between">
                <h2 id="top-rated-title" className="text-lg font-semibold">Top Rated</h2>
                 {/* Optional: Link to view all top rated */}
                 {/* <Link href="/products?sort=top-rated" className="text-sm text-primary hover:underline">
                    View All
                 </Link> */}
             </div>
             {/* Render the client component, passing the data */}
             <TopRatedProductsList products={topRatedProductsData} />
        </section>

      </main>

      {/* Bottom Navigation */}
       <footer className="sticky bottom-0 z-50 border-t bg-background">
         <nav className="flex justify-around items-center h-16">
            {/* Home (Explore) Button */}
            <Link href="/" className="flex flex-col items-center justify-center gap-1 p-2 text-primary" aria-current="page">
               <Home className="h-5 w-5" />
              <span className="text-xs font-medium">Home</span>
            </Link>
             {/* Prescription Button */}
             <Link href="/upload-prescription" className="flex flex-col items-center justify-center gap-1 p-2 text-muted-foreground hover:text-primary">
                <FileText className="h-5 w-5" />
                <span className="text-xs">Prescription</span>
             </Link>
             {/* Cart Button */}
             <Link href="/cart" className="flex flex-col items-center justify-center gap-1 p-2 text-muted-foreground hover:text-primary">
                <ShoppingBasket className="h-5 w-5" />
                <span className="text-xs">Cart</span>
             </Link>
              {/* Account Button */}
             <Link href="/account" className="flex flex-col items-center justify-center gap-1 p-2 text-muted-foreground hover:text-primary">
               <User className="h-5 w-5" />
               <span className="text-xs">Account</span>
             </Link>
         </nav>
      </footer>
    </div>
  );
}
