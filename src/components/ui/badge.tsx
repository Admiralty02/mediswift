// src/components/ui/badge.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Define clearer variant names aligned with OrderStatus
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 capitalize", // Added capitalize
  {
    variants: {
      variant: {
        // Status-based variants
        pending: // Neutral/Waiting
          "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        processing: // Active work in progress
          "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        shipped: // In transit, but not final leg
          "border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100", // Example color
        outForDelivery: // Final delivery leg
          "border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100", // Example color
        delivered: // Success
          "border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        cancelled: // Failure/Negative
          "border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",

        // General purpose variants (less common for status)
        default: // Fallback/General Info - Use sparingly for status
           "border-transparent bg-secondary text-secondary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground", // Simple outline
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, children, ...props }: BadgeProps) {
   // Map status strings (case-insensitive) to variants for convenience
   // Match keys to the Order['status'] type in pharmacy.ts
   const statusVariantMap: { [key: string]: BadgeProps['variant'] } = {
     'pending': 'pending',
     'processing': 'processing',
     'shipped': 'shipped',
     'out for delivery': 'outForDelivery', // Handle space
     'delivered': 'delivered',
     'cancelled': 'cancelled',
   };

   // Determine the variant: use explicit prop > inferred from children > fallback
   let appliedVariant = variant;
   if (!appliedVariant && typeof children === 'string') {
       const lowerCaseChildren = children.toLowerCase();
       appliedVariant = statusVariantMap[lowerCaseChildren] || 'default'; // Fallback to default if no match
   }
   appliedVariant = appliedVariant || 'default'; // Ensure a variant is always applied

  return (
    <div className={cn(badgeVariants({ variant: appliedVariant }), className)} {...props}>
      {children} {/* Render children directly */}
    </div>
  )
}

export { Badge, badgeVariants }
