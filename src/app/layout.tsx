import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import CalEmbed from "@/components/CalEmbed";
import ScrollProgressBar from "@/components/ScrollProgressBar";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tesla | Model 3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mn" className={manrope.variable}>
      <body className="font-sans antialiased">
        <ScrollProgressBar />
        {children}
        <CalEmbed />
      </body>
    </html>
  );
}
