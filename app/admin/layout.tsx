import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CMS — END Design Lab",
  description: "Content management system for END Design Lab",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
