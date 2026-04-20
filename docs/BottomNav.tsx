"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Stethoscope, Wrench, Package, QrCode } from "lucide-react";
import { useSession } from "next-auth/react";

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  // Bottom nav is restricted to these 5 main actions
  const navItems = [
    { name: "Accueil", path: "/dashboard", icon: LayoutDashboard },
    { name: "Équipements", path: "/equipment", icon: Stethoscope },
    { name: "Scan", path: "/scan", icon: QrCode, isMainButton: true },
    { name: "Maintenances", path: "/maintenance", icon: Wrench },
    { name: "Pièces", path: "/spare-parts", icon: Package },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border z-40 px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex h-full items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const Icon = item.icon;

          if (item.isMainButton) {
            return (
              <div key={item.path} className="relative -top-5">
                <Link
                  href={item.path}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-transform active:scale-95"
                >
                  <Icon className="h-6 w-6" />
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
