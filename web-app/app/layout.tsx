import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { cookies } from 'next/headers';
import { getCart } from '@/lib/shopify';
import { Toaster } from 'react-hot-toast';


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Shopify Storefront",
  description: "Custom frontend for Shopify using Next.js and Shadcn UI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const cartId = cookieStore.get('cartId')?.value;
  
  let initialCart = null;
  if (cartId) {
    initialCart = await getCart(cartId);
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main className="container mx-auto px-4 py-8">{children}</main>
        <CartDrawer initialCart={initialCart} />
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
