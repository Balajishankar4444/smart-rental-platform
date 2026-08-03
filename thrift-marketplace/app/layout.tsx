// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/context/AuthContext";



const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RentIt — Turn Unused Items Into Income | Premium Rental Marketplace",
  description: "Rent cameras, bikes, PS5s, drones, and tools safely across India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${geist.variable} h-full antialiased selection:bg-blue-600 selection:text-white`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAFA] text-[#0F172A] font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}