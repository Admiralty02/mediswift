// src/app/order-confirmation/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { placeOrder, Order } from '@/services/pharmacy'; // Import placeOrder and Order type

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);
  const [prescriptionDescription, setPrescriptionDescription] = useState<string | null>(null);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | null>(null);
  const [selectedPharmacyName, setSelectedPharmacyName] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Retrieve data from sessionStorage
    const image = sessionStorage.getItem('prescriptionImage');
    const description = sessionStorage.getItem('prescriptionDescription');
    const pharmacyId = sessionStorage.getItem('selectedPharmacyId');
    const pharmacyName = sessionStorage.getItem('selectedPharmacyName');

    // Basic validation: Ensure all required MVP data is present
    if (!image || !pharmacyId || !pharmacyName) {
      toast({
        title: 'Missing order details.',
        description: 'Please start the process again.',
        variant: 'destructive',
      });
      // Redirect back to the start or appropriate step
      router.replace('/upload-prescription');
    } else {
      setPrescriptionImage(image);
      setPrescriptionDescription(description);
      setSelectedPharmacyId(pharmacyId);
      setSelectedPharmacyName(pharmacyName);
    }
  }, [router, toast]);

  const handleConfirmOrder = async () => {
    if (!isClient || isLoading || !selectedPharmacyId || !prescriptionImage) return;

    setIsLoading(true);
    try {
      // Simulate placing the order with mock data for MVP
      // In a real app, you'd send image, description, pharmacyId to your backend
      const mockOrderData = {
        // Replace with actual user ID from auth context when implemented
        userId: 'mockUserId_MVP',
        items: [
            // For MVP, we might represent the prescription as a single 'item'
             { productId: 'PRESCRIPTION_UPLOAD', quantity: 1, price: 0 } // Price might be determined later by pharmacy
        ],
        // Total amount might also be determined later, or just use delivery fee for now
        totalAmount: 150, // Example delivery fee - adjust as needed
        // Add other necessary fields based on your Order type (excluding id, date, status initially)
        // pharmacyId: selectedPharmacyId, // If your Order type includes this
        // prescriptionDetails: { image: prescriptionImage, description: prescriptionDescription } // Example structure
      };

      // Call the mock placeOrder function (replace with real API call later)
      const placedOrder: Order = await placeOrder(mockOrderData);

      // Clear sessionStorage after successful order (optional, depends on flow)
      sessionStorage.removeItem('prescriptionImage');
      sessionStorage.removeItem('prescriptionDescription');
      sessionStorage.removeItem('selectedPharmacyId');
      sessionStorage.removeItem('selectedPharmacyName');


      toast({
        title: 'Order Placed Successfully!',
        description: `Your order ID is ${placedOrder.id}.`,
        variant: 'default', // Use 'success' variant if available/configured
        duration: 5000, // Keep toast longer
      });

      // Navigate to order tracking page with the new order ID
      router.push(`/order-tracking?orderId=${placedOrder.id}`); // Pass orderId in query params

    } catch (error) {
      console.error('Failed to place order:', error);
      toast({
        title: 'Order Placement Failed',
        description: 'There was an issue placing your order. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
    // Note: setIsLoading(false) is handled by navigation or error toast
  };

   // Prevent rendering until client-side check is complete and data is loaded
   if (!isClient || !prescriptionImage || !selectedPharmacyName) {
     return (
       <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
         <p className="text-muted-foreground mt-2">Loading confirmation...</p>
       </div>
     );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4">
        <Button variant="ghost" size="icon" asChild>
          {/* Link back to the choose pharmacy page */}
          <Link href="/choose-pharmacy">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-lg font-semibold">Confirm Order</h1>
        <div className="w-9"></div> {/* Spacer */}
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-md space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Please review your prescription order details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {/* Display Selected Pharmacy */}
               <div>
                   <p className="text-sm font-medium text-muted-foreground">Pharmacy</p>
                   <p className="font-semibold">{selectedPharmacyName ?? 'N/A'}</p>
               </div>

               {/* Display Prescription Image Preview */}
                {prescriptionImage && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Prescription Image</p>
                        <div className="relative aspect-square w-full max-w-[200px] mx-auto border rounded-md overflow-hidden">
                        <Image
                            src={prescriptionImage}
                            alt="Uploaded Prescription"
                            fill
                            style={{ objectFit: 'contain' }}
                            data-ai-hint="uploaded prescription confirmation"
                        />
                        </div>
                    </div>
                )}

                {/* Display Description */}
                {prescriptionDescription && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Notes</p>
                        <p className="text-sm whitespace-pre-wrap">{prescriptionDescription}</p>
                    </div>
                )}

                {/* Placeholder for Items/Cost (for MVP, might be just prescription) */}
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Items</p>
                    <p>Prescription Upload</p> {/* Simple placeholder */}
                </div>
                 {/* Placeholder for Total Cost (for MVP, might just be delivery fee) */}
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Estimated Cost</p>
                    <p className="font-semibold">Ksh 150.00 (Delivery Fee)</p>
                    <p className="text-xs text-muted-foreground">Medication costs will be confirmed by the pharmacy.</p>
                </div>

            </CardContent>
             <CardFooter>
                <Button
                    className="w-full"
                    size="lg"
                    onClick={handleConfirmOrder}
                    disabled={isLoading || !isClient}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Placing Order...
                        </>
                    ) : (
                         <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm & Place Order
                         </>
                    )}
                </Button>
             </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-secondary py-4 px-4 md:px-6 mt-auto">
        <p className="text-center text-sm text-muted-foreground">
          © {isClient ? new Date().getFullYear() : '...'} MediSwift. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
