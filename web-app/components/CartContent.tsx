"use client"
import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/cartStore';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import Link from 'next/link';
import { Cart, CartItem } from '@/lib/shopify';

export default function CartContent({ initialCart }: { initialCart: Cart | null }) {
  const { cart, updateItem, removeItem, setCart } = useCartStore();
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (initialCart) {
      setCart(initialCart);
    }
  }, [initialCart, setCart]);

  const handleUpdateItem = async (lineId: string, quantity: number) => {
    setLoadingItems(prev => new Set(prev).add(lineId));
    await updateItem(lineId, quantity);
    setLoadingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(lineId);
      return newSet;
    });
  };

  const handleRemoveItem = async (lineId: string) => {
    setLoadingItems(prev => new Set(prev).add(lineId));
    await removeItem(lineId);
    setLoadingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(lineId);
      return newSet;
    });
  };



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

  const renderCartItem = (item: CartItem) => {
    if (loadingItems.has(item.id)) {
      return (
        <Card key={item.id}>
          <CardContent className="flex items-center p-4">
            <Skeleton className="w-24 h-24 rounded-md mr-4" />
            <div className="flex-grow space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-center space-x-2 mt-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-20 ml-4" />
              </div>
            </div>
            <Skeleton className="h-6 w-16" />
          </CardContent>
        </Card>
      );
    }

    return (
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
            <div className="mt-2 flex items-center">
              <Button
                onClick={() => handleUpdateItem(item.id, item.quantity - 1)}
                size="sm"
                variant="outline"
              >
                -
              </Button>
              <span className="mx-2">{item.quantity}</span>
              <Button
                onClick={() => handleUpdateItem(item.id, item.quantity + 1)}
                size="sm"
                variant="outline"
              >
                +
              </Button>
              <Button
                onClick={() => handleRemoveItem(item.id)}
                size="sm"
                variant="destructive"
                className="ml-4"
              >
                Remove
              </Button>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">
              ${(parseFloat(item.merchandise.price.amount) * item.quantity).toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {cartItems.map(renderCartItem)}
      <div className="flex justify-between items-center mt-4">
        <h2 className="text-xl font-bold">Total:</h2>
        <p className="text-xl font-bold">${totalPrice.toFixed(2)}</p>
      </div>
      <Button
        className="w-full"
        onClick={() => window.location.href = cart.checkoutUrl}
      >
        Proceed to Checkout
      </Button>
    </div>
  );
}