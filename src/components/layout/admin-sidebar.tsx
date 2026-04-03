"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Building,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, labelKey: "admin.dashboard" },
  { href: "/admin/products", icon: Package, labelKey: "admin.products" },
  { href: "/admin/categories", icon: FolderTree, labelKey: "admin.categories" },
  { href: "/admin/suppliers", icon: Building, labelKey: "admin.suppliers" },
] as const;

function SidebarContent() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-l-2 border-accent bg-navy-900 text-white"
                : "text-navy-300 hover:bg-navy-900 hover:text-white"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const t = useTranslations();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col bg-navy-950 text-white">
        <div className="flex h-14 items-center border-b border-navy-800 px-6">
          <Link
            href="/admin"
            className="font-heading text-lg font-bold text-white"
          >
            JTC Admin
          </Link>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar trigger + sheet */}
      <div className="fixed top-0 left-0 z-50 flex h-14 w-full items-center gap-3 border-b border-navy-800 bg-navy-950 px-4 lg:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-navy-800"
              />
            }
          >
            <Menu className="size-5" />
            <span className="sr-only">Menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-navy-950 p-0 text-white">
            <SheetHeader className="border-b border-navy-800 px-6">
              <SheetTitle className="font-heading text-lg font-bold text-white">
                JTC Admin
              </SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <span className="font-heading text-sm font-bold text-white">
          JTC Admin
        </span>
      </div>
    </>
  );
}
