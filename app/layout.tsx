import { TitleProvider } from "@/context/title";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Metadata, Viewport } from "next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  title: "Flunky Cup",
  description: "Flunky Cup Boetzingen App",
  applicationName: "Flunky Cup",
  authors: [{ name: "jofflin", url: "https://byrd-software.de" }],
  robots: "index, follow",
  colorScheme: "light",
  // viewport: { width: "device-width", initialScale: 1, userScalable: false },
  creator: "jofflin",
  icons: { icon: "/apple-touch-icon.png", apple: "/apple-touch-icon.png" },
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black", title: "SG K/T" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
  themeColor: "#4d7c0f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="flex flex-col items-center min-h-screen">
          <TitleProvider>{children}</TitleProvider>
        </main>
      </body>
    </html>
  );
}
