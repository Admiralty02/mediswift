// src/app/choose-pharmacy/page.tsx
'use client'; // Required for client-side interactions

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card'; // Removed unused Header, Title, Desc
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'; // Import useEffect and useState
import { useToast } from '@/hooks/use-toast'; // Import useToast

// Mock Data - Replace with API call
const pharmacies = [
  { id: 'pharma1', name: 'PharmaCare', deliveryFee: 150, deliveryTime: 'Today, 1:00 PM - 5:00 PM' }, // Adjusted fee
  { id: 'pharma2', name: 'MediMart', deliveryFee: 150, deliveryTime: 'Today, 3:00 PM - 5:00 PM' }, // Adjusted fee
  { id: 'pharma3', name: 'HealthPlus', deliveryFee: 155, deliveryTime: 'Tomorrow, 10:00 AM - 1:00 PM' }, // Adjusted fee
  { id: 'pharma4', name: 'Corner Drugs', deliveryFee: 140, deliveryTime: 'Today, 12:00 PM - 4:00 PM' }, // Adjusted fee
  { id: 'pharma5', name: 'City Chemists', deliveryFee: 160, deliveryTime: 'Tomorrow, 9:00 AM - 12:00 PM' }, // Adjusted fee
];

export default function ChoosePharmacyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Retrieve prescription image from sessionStorage to ensure it exists
    const storedImage = sessionStorage.getItem('prescriptionImage');
    if (!storedImage) {
      // If no image found, redirect back to upload page (MVP approach)
      toast({ title: 'Prescription image not found.', description: 'Please upload your prescription first.', variant: 'destructive'});
      router.replace('/upload-prescription');
    } else {
      setPrescriptionImage(storedImage); // Keep image data if needed later, though not strictly necessary here
    }
    // Clear previous selection if user comes back
    sessionStorage.removeItem('selectedPharmacyId');
  }, [router, toast]);

  const handleSelectPharmacy = (pharmacyId: string, pharmacyName: string) => {
    if (!isClient) return;

    try {
        // Store selected pharmacy ID in sessionStorage
        sessionStorage.setItem('selectedPharmacyId', pharmacyId);
        sessionStorage.setItem('selectedPharmacyName', pharmacyName); // Store name for confirmation page

        console.log('Selected pharmacy ID:', pharmacyId);
        toast({ title: `${pharmacyName} selected.` });
        // Navigate to the new order confirmation page
        router.push('/order-confirmation');
    } catch (error) {
        console.error("Failed to save pharmacy selection:", error);
        toast({ title: 'Failed to select pharmacy. Please try again.', variant: 'destructive' });
    }
  };

  // Prevent rendering until client-side check is complete and image is confirmed
  if (!isClient || !prescriptionImage) {
     return (
       <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
         <p className="text-muted-foreground">Loading...</p>
         {/* Optionally add a spinner here */}
       </div>
     );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4">
        <Button variant="ghost" size="icon" asChild>
          {/* Link back to the upload prescription page */}
          <Link href="/upload-prescription">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-lg font-semibold">Choose Pharmacy</h1>
        <div className="w-9"></div> {/* Spacer */}
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-md space-y-4">
          {pharmacies.map((pharmacy) => (
            <Card
              key={pharmacy.id}
              className="cursor-pointer transition-all hover:border-primary bg-card"
              onClick={() => handleSelectPharmacy(pharmacy.id, pharmacy.name)} // Pass name as well
            >
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold text-card-foreground">{pharmacy.name}</p>
                  <p className="text-sm font-medium text-primary">
                    Delivery Fee: Ksh {pharmacy.deliveryFee.toFixed(2)} {/* Format fee */}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Est. Delivery: {pharmacy.deliveryTime}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}

          {pharmacies.length === 0 && (
             <Card className="text-center p-6">
                <p className="text-muted-foreground">Could not find pharmacies near you.</p>
                {/* Optional: Add retry button or change location link */}
            </Card>
          )}
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
