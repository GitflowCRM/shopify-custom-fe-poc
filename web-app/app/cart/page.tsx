import CartContent from '@/components/CartContent';
import { getCart } from '@/lib/shopify';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CartPage() {
  const cookieStore = cookies();
  const cartId = cookieStore.get('cartId')?.value;
  
  let cart = null;
  if (cartId) {
    cart = await getCart(cartId);
  }

  return <CartContent initialCart={cart} />;
}