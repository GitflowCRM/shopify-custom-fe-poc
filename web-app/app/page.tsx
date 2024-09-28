import ProductList from "@/components/ProductList";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/lib/shopify";

export default async function Home() {
  const products = await fetchProducts(10);

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
        <ProductList products={products} />
      </section>
    </div>
  );
}