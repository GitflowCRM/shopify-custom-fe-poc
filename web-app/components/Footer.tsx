import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">FAQs</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Returns & Refunds</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">About Us</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Our Story</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Careers</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Press</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-gray-900">Facebook</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">Instagram</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">Twitter</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p>Subscribe to our newsletter for updates and promotions.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}