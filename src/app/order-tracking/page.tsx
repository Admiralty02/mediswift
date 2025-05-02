// src/app/order-tracking/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Phone, MessageSquare, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getOrder, Order } from '@/services/pharmacy'; // Import getOrder and Order type
import { useToast } from '@/hooks/use-toast';

// Default Mock Data (used if fetching fails or no orderId)
const defaultTrackingInfo = {
  orderId: 'N/A',
  status: 'Pending',
  estimatedArrival: 'Calculating...',
  pharmacyName: 'Selected Pharmacy',
  courier: {
    name: 'Finding Courier',
    avatarUrl: 'https://picsum.photos/seed/courier_placeholder/40/40',
    rating: null,
  },
  mapImageUrl: 'https://picsum.photos/seed/map_placeholder/600/300',
  progress: 10, // Initial progress
};

// Separate component to handle search params logic
function OrderTrackingContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const { toast } = useToast();
    const [trackingInfo, setTrackingInfo] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const fetchOrderData = async () => {
        if (!orderId) {
            toast({ title: 'Order ID missing', description: 'Cannot track order.', variant: 'destructive' });
            setIsLoading(false);
            // Potentially redirect or show an error state
            return;
        }

        setIsLoading(true);
        try {
            // Fetch real order data using the orderId
            const orderData = await getOrder(orderId);
            if (orderData) {
            setTrackingInfo(orderData);
             // Simulate progress update (remove in real app)
             if(orderData.status === 'Out for Delivery') {
                 // Set interval for demo progress
                 const intervalId = setInterval(() => {
                     setTrackingInfo(prev => prev ? ({...prev, progress: Math.min((prev.progress ?? 0) + 5, 90)}) : null);
                 }, 3000);
                 // Cleanup interval on component unmount or status change
                 return () => clearInterval(intervalId);
             } else if (orderData.status === 'Delivered') {
                 setTrackingInfo(prev => prev ? ({...prev, progress: 100}) : null);
             }

            } else {
            toast({ title: 'Order not found', description: `Could not find details for order ${orderId}.`, variant: 'destructive' });
            // Keep default or show specific not found state
            setTrackingInfo(null); // Indicate not found explicitly
            }
        } catch (error) {
            console.error('Failed to fetch order:', error);
            toast({ title: 'Error fetching order', description: 'Could not load tracking details.', variant: 'destructive' });
            setTrackingInfo(null); // Indicate error state
        } finally {
            setIsLoading(false);
        }
        };

        fetchOrderData();
    }, [orderId, toast]);

     // Derive display data, using defaults if loading, error, or no data
    const displayData = isLoading || !trackingInfo ? defaultTrackingInfo : {
        orderId: trackingInfo.id,
        status: trackingInfo.status,
        // Replace with dynamic estimate based on status/API data
        estimatedArrival: trackingInfo.status === 'Out for Delivery' ? '25-40 min' : (trackingInfo.status === 'Delivered' ? 'Delivered' : 'Pending Confirmation'),
        // Fetch pharmacy name based on ID if needed, or use a default/placeholder
        pharmacyName: sessionStorage.getItem(`pharmacyName_${trackingInfo.id}`) ?? 'Selected Pharmacy', // Example: get from session or fetch
        courier: trackingInfo.status === 'Out for Delivery' || trackingInfo.status === 'Delivered' ? { // Only show courier if relevant
            name: 'Tana Bravo', // Mock courier
            avatarUrl: 'https://picsum.photos/seed/courier1/40/40',
            rating: 4.8,
        } : defaultTrackingInfo.courier,
        mapImageUrl: `https://picsum.photos/seed/map${trackingInfo.id}/600/300`, // Map per order
         // Map status to progress (example logic)
         progress: trackingInfo.status === 'Pending' ? 10 :
                   trackingInfo.status === 'Processing' ? 30 :
                   trackingInfo.status === 'Shipped' ? 50 :
                   trackingInfo.status === 'Out for Delivery' ? (trackingInfo.progress ?? 75) : // Use fetched progress if available
                   trackingInfo.status === 'Delivered' ? 100 :
                   trackingInfo.status === 'Cancelled' ? 0 : 5,
    };


     if (isLoading) {
         return (
         <div className="flex flex-1 items-center justify-center">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
         );
     }

     if (!isLoading && !trackingInfo && orderId) {
         // Specific state for order not found
         return (
             <div className="flex flex-1 items-center justify-center p-4">
                 <Card className="w-full max-w-md text-center">
                     <CardHeader>
                         <CardTitle>Order Not Found</CardTitle>
                     </CardHeader>
                     <CardContent>
                         <p className="text-muted-foreground">We couldn't find the details for order ID: {orderId}.</p>
                         <Button asChild variant="link" className="mt-4">
                            <Link href="/account/orders">View My Orders</Link>
                         </Button>
                     </CardContent>
                 </Card>
             </div>
         );
     }

    return (
        <>
         {/* Map Placeholder */}
        <div className="relative h-64 w-full md:h-80 lg:h-96">
            <Image
                src={displayData.mapImageUrl}
                alt="Order location map"
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint="map delivery location"
                priority
             />
             {/* Fade effect at the bottom */}
             <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent"></div>
        </div>

        {/* Tracking Details Card */}
        <div className="relative -mt-16 p-4 md:-mt-20 md:p-6">
            <Card className="bg-card text-card-foreground shadow-lg max-w-md mx-auto">
                <CardHeader className="pb-4">
                    <CardDescription className="text-center text-primary">
                         {displayData.status === 'Delivered' ? 'Order Status' : 'Arriving in'}
                    </CardDescription>
                    <CardTitle className="text-center text-3xl font-bold">
                       {isClient ? displayData.estimatedArrival : 'Loading...'}
                    </CardTitle>
                     <CardDescription className="text-center">
                        Order ID: {displayData.orderId} | From {displayData.pharmacyName}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     {/* Progress Bar */}
                    <Progress value={isClient ? displayData.progress : 0} className="h-2 [&>div]:bg-primary" aria-label={`Order progress: ${displayData.progress}%`} />

                     {/* Order Status Text */}
                    <p className="text-center text-sm font-medium text-muted-foreground">
                       Status: {isClient ? displayData.status : 'Loading...'}
                    </p>

                    {/* Courier Info - Conditionally render */}
                     {(displayData.status === 'Out for Delivery' || displayData.status === 'Delivered') && displayData.courier.name !== 'Finding Courier' && (
                        <div className="flex items-center justify-between rounded-lg border border-border p-3">
                            <div className="flex items-center gap-3">
                                <Image
                                    src={displayData.courier.avatarUrl}
                                    alt={displayData.courier.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full border"
                                    data-ai-hint="courier person avatar"
                                />
                                <div>
                                    <p className="font-semibold">{displayData.courier.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {isClient && displayData.courier.rating ? `Rating: ${displayData.courier.rating} ★` : 'Courier'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                 <Button variant="outline" size="icon" className="h-8 w-8 border-primary text-primary hover:bg-primary/10">
                                    <Phone className="h-4 w-4" />
                                    <span className="sr-only">Call Courier</span>
                                </Button>
                                 <Button variant="outline" size="icon" className="h-8 w-8 border-primary text-primary hover:bg-primary/10">
                                    <MessageSquare className="h-4 w-4" />
                                    <span className="sr-only">Message Courier</span>
                                </Button>
                            </div>
                        </div>
                    )}

                     {/* Rate Courier Button (Show after delivery?) */}
                      {displayData.status === 'Delivered' && (
                         <Button variant="secondary" className="w-full">
                            Rate Courier Experience
                        </Button>
                     )}

                     {/* Back to Home/Orders Button */}
                      <Button variant="outline" className="w-full" asChild>
                         <Link href="/">Back to Home</Link>
                      </Button>

                </CardContent>
            </Card>
        </div>
        </>
    );
}


export default function OrderTrackingPage() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-background px-4">
         <Button variant="ghost" size="icon" asChild className="text-foreground hover:bg-muted">
           {/* Link back to home or orders page */}
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-lg font-semibold">Order Tracking</h1>
        <div className="w-9"></div> {/* Spacer */}
      </header>

      <main className="flex-1 overflow-y-auto">
         {/* Wrap content in Suspense for useSearchParams */}
        <Suspense fallback={
            <div className="flex flex-1 items-center justify-center">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
          <OrderTrackingContent />
        </Suspense>
      </main>

       {/* Footer */}
       <footer className="border-t border-border bg-background py-4 px-4 md:px-6 mt-auto">
        <p className="text-center text-sm text-muted-foreground">
          © {isClient ? new Date().getFullYear() : '...'} MediSwift. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
