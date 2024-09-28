import { NextRequest, NextResponse } from 'next/server';
import { updateCartItem, removeCartItem, addToCart, createCart, getCart } from '@/lib/shopify';
import { cookies } from 'next/headers';

async function validateAndGetCart(cartId: string) {
  try {
    const cart = await getCart(cartId);
    return cart;
  } catch (error) {
    console.error('Error validating cart:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const action = formData.get('action') as string;

  const cookieStore = cookies();
  let cartId = cookieStore.get('cartId')?.value;

  try {
    let cart;
    if (cartId) {
      cart = await validateAndGetCart(cartId);
      if (!cart) {
        const newCart = await createCart();
        cartId = newCart.id;
        cookieStore.set('cartId', cartId, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        cart = newCart;
      }
    } else {
      const newCart = await createCart();
      cartId = newCart.id;
      cookieStore.set('cartId', cartId, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      cart = newCart;
    }

    let updatedCart;

    switch (action) {
      case 'add':
        const variantId = formData.get('variantId') as string;
        updatedCart = await addToCart(cartId, variantId, 1);
        break;
      case 'increase':
        const increaseLineId = formData.get('lineId') as string;
        const currentQuantity = cart.lines.edges.find(edge => edge.node.id === increaseLineId)?.node.quantity || 0;
        updatedCart = await updateCartItem(cartId, increaseLineId, currentQuantity + 1);
        break;
      case 'decrease':
        const decreaseLineId = formData.get('lineId') as string;
        const decreaseQuantity = cart.lines.edges.find(edge => edge.node.id === decreaseLineId)?.node.quantity || 0;
        if (decreaseQuantity > 1) {
          updatedCart = await updateCartItem(cartId, decreaseLineId, decreaseQuantity - 1);
        } else {
          updatedCart = await removeCartItem(cartId, decreaseLineId);
        }
        break;
      case 'remove':
        const removeLineId = formData.get('lineId') as string;
        updatedCart = await removeCartItem(cartId, removeLineId);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!updatedCart || updatedCart.lines.edges.length === 0) {
      const newCart = await createCart();
      cookieStore.set('cartId', newCart.id, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      updatedCart = newCart;
    }

    return NextResponse.redirect(new URL('/cart', request.url));
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = cookies();
  const cartId = cookieStore.get('cartId')?.value;

  if (!cartId) {
    return NextResponse.json({ cart: null });
  }

  try {
    const cart = await getCart(cartId);
    
    if (!cart) {
      const newCart = await createCart();
      cookieStore.set('cartId', newCart.id, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      return NextResponse.json({ cart: newCart });
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}
