import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luxe Jewelry | Timeless Elegance",
  description: "Discover our exclusive collection of handcrafted jewelry.",
};

import PasscodeLock from "@/components/auth/PasscodeLock";
import TextCursor from "@/components/ui/TextCursor";
import { ClickSpark } from "@/components/ui/ClickSpark";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased bg-background text-foreground font-sans">
        <PasscodeLock>
          <TextCursor
            text="skhah jewellery"
            spacing={300}
            followMouseDirection={true}
            randomFloat={false}
            exitDuration={0.5}
            removalInterval={10}
            maxPoints={4}
          />
          <ClickSpark sparkColor="#d4af37" sparkSize={8} sparkRadius={20} sparkCount={12} duration={0.6}>
            {children}
          </ClickSpark>
        </PasscodeLock>
      </body>
    </html>
  );
}
