import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "admin",
  description: "admin page!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
      {children}
    </div>
  );
}
