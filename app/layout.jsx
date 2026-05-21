import "@/assets/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sparkles from "@/components/Sparkles";
import CartSidebar from "@/components/CartSidebar";

import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: "Her&Her Cafe",
  description: "Aesthetic sky-blue sparkle cafe.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="flex flex-col min-h-screen relative">
        <CartProvider>
          <Sparkles />
          <Navbar />
          <CartSidebar />
          <main className="flex-grow z-10">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
