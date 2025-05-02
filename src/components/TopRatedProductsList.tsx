'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react'; // Import useState for error handling

// Define the type for a single product expected by this component
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null; // Allow null or undefined
}

interface TopRatedProductsListProps {
  products: Product[];
}

const DEFAULT_PLACEHOLDER = 'https://picsum.photos/seed/placeholder/60/60';

export default function TopRatedProductsList({ products }: TopRatedProductsListProps) {
  // State to track image loading errors for each product
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <Link href={`/products/${product.id}`} key={product.id} passHref>
          <Card className="flex items-center justify-between p-3 transition-colors hover:bg-secondary/50 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 flex-shrink-0"> {/* Container for image */}
                <Image
                   // Use placeholder if error occurred or imageUrl is missing
                  src={imageErrors[product.id] || !product.imageUrl ? DEFAULT_PLACEHOLDER : product.imageUrl}
                  alt={product.name}
                  fill // Use fill for responsive container
                  style={{ objectFit: 'cover' }} // Ensure image covers the area
                  className="rounded-md border"
                  data-ai-hint="medicine product thumbnail"
                   // Handle loading errors specifically for this image
                   onError={() => handleImageError(product.id)}
                   sizes="(max-width: 768px) 10vw, 40px" // Provide sizes hint
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground line-clamp-1">{product.name}</p>
                <p className="text-sm font-bold text-primary">Ksh {product.price.toFixed(2)}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          </Card>
        </Link>
      ))}
      {products.length === 0 && (
        <p className="text-muted-foreground text-center text-sm mt-4">
          No top rated products found.
        </p>
      )}
    </div>
  );
}
