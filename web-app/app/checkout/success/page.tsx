'use client';
import { useSearchParams } from 'next/navigation';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
      <p>Your order number is: {orderId}</p>
      {/* Add more custom content here */}
    </div>
  );
}