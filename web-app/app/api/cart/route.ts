import { NextRequest, NextResponse } from 'next/server';
import { updateCartItem, removeCartItem, addToCart, createCart, getCart } from '@/lib/shopify';
import { cookies } from 'next/headers';

async function validateAndGetCart(cartId: string) {
  try {
    const cart = await getCart(cartId);
    if (cart && cart.id) {
      return cart;
    }
  } catch (error) {
    console.error('Error validating cart:', error);
  }
  return null;
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
        // If the cart is invalid or empty, create a new one
        const newCart = await createCart();
        cartId = newCart.id;
        cookieStore.set('cartId', cartId, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        cart = newCart;
      }
    } else {
      // If there's no cartId, create a new cart
      const newCart = await createCart();
      cartId = newCart.id;
      cookieStore.set('cartId', cartId, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      cart = newCart;
    }

    let updatedCart;

    if (action === 'add') {
      const variantId = formData.get('variantId') as string;
      updatedCart = await addToCart(cartId, variantId, 1);
    } else {
      const lineId = formData.get('lineId') as string;

      switch (action) {
        case 'increase':
          updatedCart = await updateCartItem(cartId, lineId, cart.lines.edges.find(edge => edge.node.id === lineId)?.node?.quantity ?? 0 + 1);
          break;
        case 'decrease':
          const currentQuantity = cart.lines.edges.find(edge => edge.node.id === lineId)?.node?.quantity ?? 0;
          if (currentQuantity > 1) {
            updatedCart = await updateCartItem(cartId, lineId, currentQuantity - 1);
          } else {
            updatedCart = await removeCartItem(cartId, lineId);
          }
          break;
        case 'remove':
          updatedCart = await removeCartItem(cartId, lineId);
          break;
        default:
          return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
      }
    }

    // Check if the cart is empty after the operation
    if (!updatedCart || updatedCart.lines.edges.length === 0) {
      // If the cart is empty, create a new one
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
    const cart = await validateAndGetCart(cartId);
    
    if (!cart) {
      // If the cart is invalid or empty, create a new one
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