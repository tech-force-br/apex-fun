import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LocaleProvider } from "@/components/locale-provider";
import { MockAuthProvider } from "@/components/mock-auth-provider";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ApexFun",
  description:
    "Teach Apex fundamentals with little theory and many small, checked exercises.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <MockAuthProvider>
          <LocaleProvider>
            <div className="relative flex flex-1 flex-col">{children}</div>
            <SiteFooter />
          </LocaleProvider>
        </MockAuthProvider>
      </body>
    </html>
  );
}
