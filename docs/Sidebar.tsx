"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Stethoscope,
  Wrench,
  Package,
  FileText,
  ShoppingCart,
  Bot,
  ActivitySquare,
  QrCode,
  Settings,
  LogOut,
  Activity
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { ROLE_LABELS } from "@/lib/formatters";

const ROUTES = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMINISTRATEUR", "RESPONSABLE_BIOMEDICAL", "TECHNICIEN", "PERSONNEL_MEDICAL"],
  },
  {
    name: "Équipements",
    path: "/equipment",
    icon: Stethoscope,
    roles: ["ADMINISTRATEUR", "RESPONSABLE_BIOMEDICAL", "TECHNICIEN", "PERSONNEL_MEDICAL"],
  },
  {
    name: "Maintenance",
    path: "/maintenance",
    icon: Wrench,
    roles: ["ADMINISTRATEUR", "RESPONSABLE_BIOMEDICAL", "TECHNICIEN", "PERSONNEL_MEDICAL"],
  },
  {
    name: "Pièces Détachées",
    path: "/spare-parts",
    icon: Package,
    roles: ["ADMINISTRATEUR", "RESPONSABLE_BIOMEDICAL", "TECHNICIEN"],
  },
  {
    name: "Contrats",
    path: "/contracts",
    icon: FileText,
    roles: ["ADMINISTRATEUR", "RESPONSABLE_BIOMEDICAL"],
  },
  {
    name: "Achats & Offres",
    path: "/procurement",
    icon: ShoppingCart,
    roles: ["ADMINISTRATEUR", "RESPONSABLE_BIOMEDICAL"],
  },
  {
    name: "Assistant IA",
    path: "/ai",
    icon: Bot,
    roles: ["ADMINISTRATEUR", "RESPONSABLE_BIOMEDICAL"],
  },
  {
    name: "Prédictif",
    path: "/predictive",
    icon: ActivitySquare,
    roles: ["ADMINISTRATEUR", "RESPONSABLE_BIOMEDICAL"],
  },
  {
    name: "Scanner QR",
    path: "/scan",
    icon: QrCode,
    roles: ["ADMINISTRATEUR", "RESPONSABLE_BIOMEDICAL", "TECHNICIEN", "PERSONNEL_MEDICAL"],
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const allowedRoutes = Object.values(ROUTES).filter((route) =>
    userRole ? route.roles.includes(userRole) : false
  );

  return (
    <aside className="hidden lg:flex h-screen w-64 flex-col bg-card border-r border-border shadow-sidebar fixed left-0 top-0 z-40 transition-all duration-300">
      {/* Brand */}
      <div className="flex h-16shrink-0 items-center px-6 border-b border-border mb-4">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-lg text-primary tracking-tight">EquipCare</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-2 gap-1 custom-scrollbar">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 mt-2">
          Menu Principal
        </div>
        {allowedRoutes.map((route) => {
          const isActive = pathname.startsWith(route.path);
          const Icon = route.icon;
          return (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"
                  )}
                />
                {route.name}
              </div>
            </Link>
          );
        })}

        {/* Admin section for Administrator only */}
        {userRole === "ADMINISTRATEUR" && (
          <>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 mt-6">
              Administration
            </div>
            <Link
              href="/admin"
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                pathname.startsWith("/admin")
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
               <Settings className={cn("h-5 w-5", pathname.startsWith("/admin") ? "text-white" : "group-hover:text-primary")} />
              Paramètres
            </Link>
          </>
        )}
      </div>

      {/* User profile section */}
      <div className="mt-auto border-t border-border p-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate">{session?.user?.name}</span>
            <span className="text-xs text-muted-foreground truncate">
              {ROLE_LABELS[userRole || ""] || "Utilisateur"}
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-2 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
            title="Se déconnecter"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
