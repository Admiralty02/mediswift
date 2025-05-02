import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'MediSwift', // Updated title to MediSwift as seen in the image
  description: 'Your trusted partner for medicines and health products.', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased'
          // Removed inter.variable - Ensure font is handled in globals.css
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
