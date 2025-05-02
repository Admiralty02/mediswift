// src/app/account/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, History, ShoppingBag, ChevronRight, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge'; // Import Badge component
import { getOrderHistory, Order, Product, getProducts } from '@/services/pharmacy'; // Import Order type and service
import { format } from 'date-fns'; // For date formatting

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Replace 'mockUserId_MVP' with actual user ID from auth context when implemented
        const fetchedOrders = await getOrderHistory('mockUserId_MVP');
        const fetchedProducts = await getProducts(); // Fetch products to get names
        setOrders(fetchedOrders);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch order history:", error);
        // TODO: Add user-facing error handling (e.g., toast)
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

   const getProductName = (productId: string): string => {
    if (productId === 'PRESCRIPTION_UPLOAD') {
        return 'Prescription Upload Order';
    }
    const product = products.find(p => p.id === productId);
    return product?.name ?? `Product ID: ${productId}`;
  };

  // Get a summary of items for display
  const getOrderSummary = (order: Order): string => {
      if (order.items.length === 0) return 'No items';
      const firstItemName = getProductName(order.items[0].productId);
      if (order.items.length === 1) return firstItemName;
      return `${firstItemName} + ${order.items.length - 1} more`;
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
        <h1 className="flex-1 text-center text-lg font-semibold">Order History</h1>
        <div className="w-9"></div> {/* Spacer */}
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-md space-y-4">
          {isLoading && isClient && (
             <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading orders...</span>
             </div>
          )}

          {!isLoading && isClient && orders.length === 0 && (
            <Card className="text-center">
                <CardHeader>
                    <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <CardTitle>No Orders Yet</CardTitle>
                </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                <Button asChild>
                  <Link href="/">Start Shopping</Link>
                </Button>
                 <Button asChild variant="outline" className="ml-2">
                    <Link href="/upload-prescription">Upload Prescription</Link>
                 </Button>
              </CardContent>
            </Card>
          )}

          {!isLoading && isClient && orders.length > 0 && (
            orders.map((order) => (
              <Link href={`/order-tracking?orderId=${order.id}`} key={order.id} className="block">
                <Card className="hover:bg-secondary/50 transition-colors active:bg-secondary/70">
                  <CardContent className="flex items-center justify-between p-4 gap-4">
                    <div className="flex-1 space-y-1 overflow-hidden">
                       {/* Order ID and Date */}
                        <div className="flex justify-between items-baseline">
                            <p className="text-xs font-semibold text-primary truncate">ID: {order.id}</p>
                            <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {format(new Date(order.orderDate), 'MMM d, yyyy')} {/* Format date */}
                            </p>
                        </div>

                        {/* Item Summary */}
                        <p className="text-sm font-medium text-foreground truncate" title={getOrderSummary(order)}>
                            {getOrderSummary(order)}
                        </p>

                        {/* Status Badge and Total */}
                         <div className="flex justify-between items-center pt-1">
                            <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : order.status === 'Out for Delivery' ? 'info' : 'secondary'}>
                              {order.status}
                            </Badge>
                            {/* Only show total if not a simple prescription upload */}
                             {order.items.length > 0 && order.items[0].productId !== 'PRESCRIPTION_UPLOAD' && (
                                <p className="text-sm font-semibold text-foreground">
                                    Ksh {order.totalAmount.toFixed(2)}
                                </p>
                             )}
                              {order.items.length > 0 && order.items[0].productId === 'PRESCRIPTION_UPLOAD' && (
                                 <p className="text-sm font-semibold text-muted-foreground">
                                    Cost TBD
                                </p>
                             )}
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </main>

      {/* Footer can be empty or removed if not needed, or add navigation */}
       <footer className="border-t bg-secondary py-4 px-4 md:px-6 mt-auto">
        <p className="text-center text-sm text-muted-foreground">
          © {isClient ? new Date().getFullYear() : '...'} MediSwift. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
