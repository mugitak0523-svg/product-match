import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Header } from "@/components/header";
import { NotificationToast } from "@/components/notification-toast";
import "./globals.css";
import "./notifications.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: { default: "Product Match", template: "%s · Product Match" },
  description: "Discover products, one battle at a time.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${inter.variable} ${display.variable}`}><Header /><NotificationToast /><main>{children}</main><footer><span>Product Match</span><span>Two products. One winner.</span></footer></body></html>;
}
