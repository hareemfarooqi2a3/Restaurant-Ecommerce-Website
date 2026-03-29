import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "../../components/Footer";
import DynamicNavbar from "../../components/DynamicNavbar";
import AIChatbot from "../../components/AIChatbot";
import MarketingPopup from "../../components/MarketingPopup";
import GlobalEffects from "../../components/GlobalEffects";
import PageLoader from "../../components/PageLoader";

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
  title: "FoodTuck — International Cuisine Delivered Fresh",
  description:
    "Order restaurant-quality international cuisine online. Freshly prepared, carefully packed, delivered fast. Track your order in real time.",
  keywords: "food delivery, restaurant, international cuisine, online order, fresh food",
  openGraph: {
    title: "FoodTuck — International Cuisine Delivered Fresh",
    description: "Fresh flavors, fast delivery — right at your doorstep.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PageLoader />
        <DynamicNavbar>
          <GlobalEffects>
            {children}
            <Footer />
          </GlobalEffects>
          <AIChatbot />
          <MarketingPopup />
        </DynamicNavbar>
      </body>
    </html>
  );
}
