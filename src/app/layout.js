import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Rainy Calculater",
  description: "This tool helps you calculate the amount of rainwater you can harvest annually based on your location's rainfall and your roof area. Using this data, it recommends the most suitable Rainy Filter for your home and estimates how much you can save on water bills. You can also check your potential ROI (Return on Investment) to see how quickly your investment in a rainwater filter pays off.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
