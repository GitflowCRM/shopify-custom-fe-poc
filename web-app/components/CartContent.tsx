"use client"
import { Cart } from '@/lib/shopify';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';

export default function CartContent({ cart }: { cart: Cart | null }) {
  if (!cart || cart.lines.edges.length === 0) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/" passHref>
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const cartItems = cart.lines.edges.map(edge => edge.node);
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (parseFloat(item.merchandise.price.amount) * item.quantity);
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="grid gap-6 mb-8">
        {cartItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-center p-4">
              {item.merchandise.product.featuredImage && (
                <div className="w-24 h-24 relative mr-4">
                  <Image
                    src={item.merchandise.product.featuredImage.url}
                    alt={item.merchandise.product.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-md"
                  />
                </div>
              )}
              <div className="flex-grow">
                <h3 className="font-semibold">{item.merchandise.product.title}</h3>
                <p className="text-sm text-gray-600">{item.merchandise.title}</p>
                <form action="/api/cart" method="POST" className="mt-2 flex items-center">
                  <input type="hidden" name="lineId" value={item.id} />
                  <input type="hidden" name="cartId" value={cart.id} />
                  <Button
                    type="submit"
                    name="action"
                    value="decrease"
                    size="sm"
                    variant="outline"
                  >
                    -
                  </Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button
                    type="submit"
                    name="action"
                    value="increase"
                    size="sm"
                    variant="outline"
                  >
                    +
                  </Button>
                  <Button
                    type="submit"
                    name="action"
                    value="remove"
                    size="sm"
                    variant="destructive"
                    className="ml-4"
                  >
                    Remove
                  </Button>
                </form>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ${(parseFloat(item.merchandise.price.amount) * item.quantity).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Total:</h2>
        <p className="text-2xl font-bold">${totalPrice.toFixed(2)}</p>
      </div>
      <div className="flex justify-end">
        <Button
          className="w-full md:w-auto"
          onClick={() => window.location.href = cart.checkoutUrl}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}