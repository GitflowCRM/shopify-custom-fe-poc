"use client"
import { useEffect } from 'react';
import { useCartStore } from '@/lib/cartStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from 'lucide-react';
import CartContent from './CartContent';
import { Cart } from '@/lib/shopify';

interface CartDrawerProps {
  initialCart: Cart | null;
}

export default function CartDrawer({ initialCart }: CartDrawerProps) {
  const { cart, initializeCart, setCart } = useCartStore();

  useEffect(() => {
    if (initialCart) {
      setCart(initialCart);
    } else {
      initializeCart();
    }
  }, [initialCart, setCart, initializeCart]);

  const itemCount = cart?.lines.edges.reduce((total, edge) => total + edge.node.quantity, 0) || 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="fixed bottom-4 right-4 z-50">
          <ShoppingCart className="mr-2" />
          Cart ({itemCount})
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-white border-l border-gray-200 shadow-xl">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-2xl font-bold">Your Cart</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto h-[calc(100vh-8rem)]">
          <CartContent initialCart={cart} />
        </div>
      </SheetContent>
    </Sheet>
  );
}