import { AdminSidebar } from "@/components/layout/admin-sidebar";

export const metadata = { title: "Admin — Jakarta Trade Connect" };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-muted/30 p-4 pt-18 lg:ml-64 lg:p-8 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
