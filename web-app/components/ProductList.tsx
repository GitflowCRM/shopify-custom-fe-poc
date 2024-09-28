import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Product } from '@/lib/shopify';
import Image from 'next/image';

export default function ProductList({ products }: { products: Product[] }) {
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
          <CardFooter>
            <form action="/api/cart" method="POST" className="w-full">
              <input type="hidden" name="variantId" value={product?.variants?.edges?.[0]?.node?.id ?? ''} />
              <input type="hidden" name="action" value="add" />
              <Button type="submit" className="w-full">
                Add to Cart
              </Button>
            </form>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}