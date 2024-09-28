import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Store Name
        </Link>
        <div className="flex items-center space-x-4">
          <Input className="w-64" placeholder="Search" />
          <Button variant="ghost">Sign In</Button>
          <Button variant="ghost">Cart</Button>
        </div>
      </div>
    </header>
  );
}