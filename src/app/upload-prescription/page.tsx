// src/app/upload-prescription/page.tsx
'use client'; // Required for state and event handlers

import { useState, useEffect } from 'react'; // Import useEffect for sessionStorage
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Ensure Label is imported
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function UploadPrescriptionPage() {
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isClient, setIsClient] = useState(false); // State to track client-side mount
  const { toast } = useToast();
  const router = useRouter();

  // Ensure sessionStorage is accessed only on the client
  useEffect(() => {
    setIsClient(true);
    // Clear previous session data on mount
    sessionStorage.removeItem('prescriptionImage');
    sessionStorage.removeItem('prescriptionDescription');
    sessionStorage.removeItem('selectedPharmacyId');
  }, []);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, source: 'file' | 'camera') => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPrescriptionImage(result);
        setIsUploading(false);
        toast({ title: source === 'file' ? 'Image selected' : 'Photo taken', description: file.name });
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast({ title: 'Error reading file', variant: 'destructive' });
      };
      reader.readAsDataURL(file);
    }
  };


  const handleNext = () => {
    if (!isClient) return; // Don't run on server

    if (!prescriptionImage) {
        toast({ title: 'Please upload a prescription image', variant: 'destructive' });
        return;
    }
    try {
        // Store data in sessionStorage for MVP simplicity
        sessionStorage.setItem('prescriptionImage', prescriptionImage);
        sessionStorage.setItem('prescriptionDescription', description);

        toast({ title: 'Prescription details saved. Proceeding to choose pharmacy...' });
        // Navigate to the choose pharmacy page
        router.push('/choose-pharmacy');
    } catch (error) {
        console.error("Failed to save to sessionStorage:", error);
        toast({ title: 'Failed to proceed. Please try again.', variant: 'destructive' });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-lg font-semibold">Upload Prescription</h1>
        <div className="w-9"></div> {/* Spacer to balance the back button */}
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-md">
          {/* Image Upload Area */}
          <Card className="mb-6 border-dashed border-2 border-border hover:border-primary transition-colors">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center aspect-square">
              <Input
                type="file"
                id="prescriptionUpload"
                accept="image/*" // Allow any image type
                className="hidden"
                onChange={(e) => handleImageChange(e, 'file')}
                disabled={isUploading}
              />
               {/* Separate input for camera */}
               <Input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, 'camera')}
                  id="cameraUpload"
                  disabled={isUploading}
               />
              <label
                htmlFor="prescriptionUpload"
                className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
              >
                {isUploading ? (
                  <p className="text-muted-foreground">Uploading...</p>
                ) : prescriptionImage ? (
                  <div className="relative w-full h-full">
                     <Image
                      src={prescriptionImage}
                      alt="Prescription preview"
                      fill // Use fill layout
                      style={{ objectFit: 'contain' }} // Ensure image fits within container
                      className="rounded-md"
                      data-ai-hint="uploaded prescription"
                    />
                     <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                         <p className="text-white text-sm font-medium">Change image</p>
                     </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium text-foreground mb-1">
                      Tap to upload image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Upload a clear picture of your prescription
                    </p>
                     {/* Button to trigger camera input */}
                      <Button asChild variant="link" size="sm" className="mt-2" onClick={(e) => e.stopPropagation()}>
                         <label htmlFor="cameraUpload" className="cursor-pointer">
                            Or take a photo
                         </label>
                      </Button>
                  </>
                )}
              </label>
            </CardContent>
          </Card>

          {/* Description Input */}
          <div className="mb-6">
            <Label htmlFor="description" className="mb-2 block text-sm font-medium">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any notes for the pharmacy, e.g., preferred brand, urgency..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Next Button */}
          <Button
             className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
             size="lg"
             onClick={handleNext}
             disabled={isUploading || !prescriptionImage || !isClient} // Disable if uploading, no image, or not client-side
            >
            Next
          </Button>
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
