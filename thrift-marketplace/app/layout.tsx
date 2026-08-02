// app/layout.tsx
import type { Metadata } from "next";
import { Poppins, Inter, Manrope } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "RentIt — Turn Unused Items Into Income | Premium Peer-to-Peer Rental Marketplace",
  description: "Rent cameras, bikes, PS5s, drones, and tools safely across India. Verified users, instant payouts, and ₹50,000 insurance coverage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${manrope.variable} h-full antialiased selection:bg-blue-600 selection:text-white`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAFA] text-[#111827] font-sans">
        {children}
      </body>
    </html>
  );
}