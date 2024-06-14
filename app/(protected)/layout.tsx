import AuthButton from "@/components/AuthButton";
import Header from "@/components/header.component";
import Navigation from "@/components/navigation.component";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <Header />
      <div className="h-16" />

      <div className="flex-1 flex flex-col px-3 py-6 w-full">
        <main className="flex-1 flex flex-col gap-6">{children}</main>
      </div>

      <div className="h-16" />
      <Navigation />
    </div>
  );
}
