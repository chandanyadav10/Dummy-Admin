import type { Metadata } from "next";
import { ReactNode } from "react";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Dummy Admin",
  description: "Admin dashboard using DummyJSON, Next.js, Zustand, MUI, NextAuth",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
