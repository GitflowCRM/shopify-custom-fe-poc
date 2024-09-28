import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { getCart } from '@/lib/shopify';
import { cookies } from 'next/headers';

export default async function Header() {
  const cookieStore = cookies();
  const cartId = cookieStore.get('cartId')?.value;
  
  let itemCount = 0;
  if (cartId) {
    const cart = await getCart(cartId);
    itemCount = cart?.lines.edges.reduce((total, edge) => total + edge.node.quantity, 0) || 0;
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Shopify Store
        </Link>
        <nav>
          <Link href="/cart" className="flex items-center">
            <ShoppingCart className="mr-2" />
            Cart ({itemCount})
          </Link>
        </nav>
      </div>
    </header>
  );
}