import ProductList from "@/components/ProductList";
import { Button } from "@/components/ui/button";
import { fetchProducts, getCart } from "@/lib/shopify";
import { cookies } from 'next/headers';

export default async function Home() {
  const products = await fetchProducts(10);
  
  const cookieStore = cookies();
  const cartId = cookieStore.get('cartId')?.value;
  
  let cart = null;
  if (cartId) {
    cart = await getCart(cartId);
  }

  // Create a map of variant IDs to quantities
  const cartItemsMap = new Map();
  if (cart) {
    cart.lines.edges.forEach(edge => {
      cartItemsMap.set(edge.node.merchandise.id, edge.node.quantity);
    });
  }

  // Add quantity to products
  const productsWithQuantity = products.map(product => ({
    ...product,
    cartQuantity: cartItemsMap.get(product.variants.edges[0].node.id) || 0
  }));

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Store</h1>
        <p className="text-xl mb-6">Discover our amazing products!</p>
        <Button asChild>
          <a href="/products">Shop Now</a>
        </Button>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        <ProductList products={productsWithQuantity} />
      </section>
    </div>
  );
}