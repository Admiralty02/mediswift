// src/services/pharmacy.ts

/**
 * Represents a medicine or health product.
 */
export interface Product {
  /**
   * The unique identifier of the product.
   */
  id: string;
  /**
   * The name of the product.
   */
  name: string;
  /**
   * A brief description of the product.
   * Optional, as not all list items in the screenshot show descriptions.
   */
  description?: string;
  /**
   * The price of the product (assuming Ksh based on screenshots).
   */
  price: number;
  /**
   * URL of product image.
   */
  imageUrl: string;
  /**
   * Optional category for filtering.
   */
  category?: 'medicines' | 'essentials';
   /**
   * Optional rating.
   */
  rating?: number; // Added rating
}

/**
 * Asynchronously retrieves a list of products.
 *
 * @returns A promise that resolves to an array of Product objects.
 */
export async function getProducts(): Promise<Product[]> {
  // TODO: Implement this by calling an API.

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50));

  // Updated mock data reflecting potential structure and image sizes
  return [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      description: 'Effective pain reliever. 24 tabs.', // Shorter description
      price: 599, // Example price in Ksh
      imageUrl: 'https://picsum.photos/seed/paracetamol/60/60', // Smaller image size
      category: 'medicines',
      rating: 4.5,
    },
    {
      id: '2',
      name: 'Fabric Band-Aids (Assorted)',
      description: 'Flexible adhesive bandages. 50 ct.',
      price: 349,
      imageUrl: 'https://picsum.photos/seed/bandaids/60/60',
      category: 'essentials',
      rating: 4.2,
    },
     {
      id: '3',
      name: 'Digital Thermometer',
      description: 'Fast and accurate temperature reading.',
      price: 1299, // Example price
      imageUrl: 'https://picsum.photos/seed/thermometer/60/60',
      category: 'essentials',
      rating: 4.8, // Higher rating example
    },
    {
      id: '4',
      name: 'Antiseptic Wipes',
      description: 'Individually wrapped cleansing wipes. 100 ct.',
      price: 785,
      imageUrl: 'https://picsum.photos/seed/wipes/60/60',
      category: 'essentials',
      rating: 4.6,
    },
    {
      id: '5',
      name: 'Ibuprofen 200mg',
      description: 'Anti-inflammatory for pain relief. 50 tabs.',
      price: 650,
      imageUrl: 'https://picsum.photos/seed/ibuprofen/60/60',
      category: 'medicines',
      rating: 4.7, // Higher rating example
    },
     {
      id: '6',
      name: 'Saline Nasal Spray',
      description: 'Gentle mist for nasal congestion.',
      price: 820,
      imageUrl: 'https://picsum.photos/seed/nasalspray/60/60',
      category: 'medicines',
      rating: 4.3,
    },
     {
      id: '7',
      name: 'Vitamin C 1000mg',
      description: 'Supports immune system health. 60 tabs.',
      price: 995,
      imageUrl: 'https://picsum.photos/seed/vitaminc/60/60',
      category: 'essentials',
      rating: 4.4,
    },
    {
      id: '8',
      name: 'Hand Sanitizer Gel',
      description: 'Kills 99.9% of germs. 250ml.',
      price: 450,
      imageUrl: 'https://picsum.photos/seed/sanitizer/60/60',
      category: 'essentials',
      rating: 4.0,
    },
  ];
}

/**
 * Represents an order placed by a patient.
 */
export interface Order {
  /**
   * The unique identifier of the order.
   */
  id: string;
  /**
   * The user ID of the user who placed the order.
   * Replace 'mockUserId_MVP' with actual user ID implementation.
   */
  userId: string;
  /**
   * The date the order was placed.
   */
  orderDate: string;
  /**
   * The items included in the order.
   */
  items: OrderItem[];
  /**
   * The total amount of the order (could be just delivery for MVP prescription).
   */
  totalAmount: number; // Assuming Ksh
  /**
   * The status of the order.
   */
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Out for Delivery';
   /**
    * The ID of the pharmacy fulfilling the order (optional for now).
    */
   pharmacyId?: string;
   /**
    * Details of the uploaded prescription (optional for MVP).
    */
   prescriptionDetails?: {
       image: string; // Data URI or URL
       description?: string;
   };
   /**
    * Current progress percentage for tracking (optional).
    */
    progress?: number;
}

/**
 * Represents an item in an order.
 */
export interface OrderItem {
  /**
   * The product ID of the item (can be 'PRESCRIPTION_UPLOAD' for MVP).
   */
  productId: string;
  /**
   * The quantity of the item.
   */
  quantity: number;
  /**
   * The price of the item at the time of order (Ksh).
   * Price might be 0 or TBD for prescription uploads initially.
   */
  price: number;
}


// Mock database for orders
// IMPORTANT: Clear this array or use a proper DB in a real app
const mockOrders: Order[] = [
    {
      id: '101',
      userId: 'user123',
      orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      items: [
        { productId: '1', quantity: 2, price: 599 },
        { productId: '2', quantity: 1, price: 349 },
      ],
      totalAmount: (2 * 599) + 349,
      status: 'Delivered',
      progress: 100,
    },
    {
      id: '102',
      userId: 'user123',
      orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      items: [
        { productId: '3', quantity: 1, price: 1299 },
      ],
      totalAmount: 1299,
      status: 'Shipped',
       progress: 50,
    },
     {
      id: '103',
      userId: 'anotherUser', // Different user
      orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        { productId: '5', quantity: 1, price: 650 },
      ],
      totalAmount: 650,
      status: 'Delivered',
       progress: 100,
    },
     {
      id: 'ORD12345', // Match tracking example
      userId: 'user123',
      orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      items: [
        { productId: '7', quantity: 1, price: 995 },
         { productId: '8', quantity: 2, price: 450 },
      ],
      totalAmount: 995 + (2 * 450),
      status: 'Out for Delivery', // Match tracking example
      progress: 75, // Initial progress for out for delivery
    },
    // Add a prescription order example
     {
      id: 'PRESCRIP_1',
      userId: 'mockUserId_MVP',
      orderDate: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 mins ago
      items: [ { productId: 'PRESCRIPTION_UPLOAD', quantity: 1, price: 0 } ],
      totalAmount: 150, // Just delivery fee
      status: 'Processing', // Pharmacy needs to review
      pharmacyId: 'pharma1', // Example pharmacy
      prescriptionDetails: {
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // Placeholder tiny image data URI
          description: 'Urgent refill needed.'
      },
       progress: 30,
    },
];


/**
 * Asynchronously places an order.
 *
 * @param orderData The data for the new order (excluding id, orderDate, status).
 * @returns A promise that resolves to the placed Order object.
 */
export async function placeOrder(orderData: Omit<Order, 'id' | 'orderDate' | 'status'>): Promise<Order> {
  // TODO: Implement this by calling a real API.

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150)); // Slightly longer delay

  const newOrder: Order = {
    id: `ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // More unique ID
    userId: orderData.userId,
    orderDate: new Date().toISOString(),
    items: orderData.items,
    totalAmount: orderData.totalAmount,
    status: 'Pending', // Initial status
    pharmacyId: orderData.pharmacyId, // Include pharmacy ID if provided
    prescriptionDetails: orderData.prescriptionDetails, // Include prescription details if provided
    progress: 10, // Initial progress
  };

  mockOrders.push(newOrder); // Add to mock database (IN-MEMORY ONLY)
  console.log("Placed new order:", newOrder);
  // Save pharmacy name to session storage for easy retrieval on tracking page (MVP HACK)
  if (orderData.pharmacyId) {
      const pharmacyName = sessionStorage.getItem('selectedPharmacyName') ?? `Pharmacy ${orderData.pharmacyId}`;
      sessionStorage.setItem(`pharmacyName_${newOrder.id}`, pharmacyName);
  }
  return newOrder;
}

/**
 * Asynchronously retrieves order history for a user.
 *
 * @param userId The ID of the user.
 * @returns A promise that resolves to an array of Order objects.
 */
export async function getOrderHistory(userId: string): Promise<Order[]> {
  // TODO: Implement this by calling an API.

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50));

  // Return orders matching userId from the mock in-memory array
  return mockOrders.filter(order => order.userId === userId).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()); // Filter by user and sort newest first
}

/**
 * Asynchronously retrieves the details of a specific order.
 *
 * @param orderId The ID of the order.
 * @returns A promise that resolves to the Order object or undefined if not found.
 */
export async function getOrder(orderId: string): Promise<Order | undefined> {
  // TODO: Implement this by calling an API.

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50));

   // Find order in the mock in-memory array
  const order = mockOrders.find(order => order.id === orderId);
  // console.log(`getOrder(${orderId}) found:`, order); // Debug log
  return order;
}
