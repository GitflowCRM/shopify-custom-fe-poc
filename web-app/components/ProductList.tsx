"use client"
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Product } from '@/lib/shopify';
import { useCartStore } from '@/lib/cartStore';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface ProductWithQuantity extends Product {
  cartQuantity: number;
}

export default function ProductList({ products: initialProducts }: { products: ProductWithQuantity[] }) {
  const { cart, addItem, updateItem, removeItem } = useCartStore();
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    if (cart) {
      const cartItemsMap = new Map(cart.lines.edges.map(edge => [edge.node.merchandise.id, edge.node.quantity]));
      setProducts(prevProducts => 
        prevProducts.map(product => ({
          ...product,
          cartQuantity: cartItemsMap.get(product.variants.edges[0].node.id) || 0
        }))
      );
    }
  }, [cart]);

  const handleAddToCart = async (product: ProductWithQuantity) => {
    const variantId = product.variants.edges[0].node.id;
    try {
      if (product.cartQuantity === 0) {
        await addItem(variantId, 1);
      } else {
        await updateItem(product.id, product.cartQuantity + 1);
      }
      toast.success('Item added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleRemoveFromCart = async (product: ProductWithQuantity) => {
    try {
      if (product.cartQuantity === 1) {
        await removeItem(product.id);
      } else {
        await updateItem(product.id, product.cartQuantity - 1);
      }
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products?.map((product) => (
        <Card key={product?.id}>
          <CardContent className="p-4">
            {product?.images?.edges?.[0]?.node && (
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={product.images.edges[0].node.url}
                  alt={product?.title ?? ''}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-md"
                />
              </div>
            )}
            <h3 className="font-medium">{product?.title}</h3>
            <p className="text-gray-600">
              {product?.priceRange?.minVariantPrice?.amount} {product?.priceRange?.minVariantPrice?.currencyCode}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            {product.cartQuantity > 0 ? (
              <div className="flex items-center">
                <Button 
                  onClick={() => handleRemoveFromCart(product)}
                  size="sm"
                  variant="outline"
                >
                  -
                </Button>
                <span className="mx-2">{product.cartQuantity}</span>
                <Button 
                  onClick={() => handleAddToCart(product)}
                  size="sm"
                  variant="outline"
                >
                  +
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}