"use client";

import { Bell, Moon, Sun, Search, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getPageTitle = () => {
    switch (true) {
      case pathname === "/dashboard": return "Tableau de Bord";
      case pathname.startsWith("/equipment"): return "Équipements";
      case pathname.startsWith("/maintenance"): return "Maintenance";
      case pathname.startsWith("/spare-parts"): return "Pièces Détachées";
      case pathname.startsWith("/contracts"): return "Contrats";
      case pathname.startsWith("/procurement"): return "Achats & Offres";
      case pathname.startsWith("/ai"): return "Assistant IA";
      case pathname.startsWith("/predictive"): return "Maintenance Prédictive";
      case pathname.startsWith("/scan"): return "Scanner QR";
      case pathname.startsWith("/admin"): return "Administration";
      default: return "";
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-card/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-colors">
      
      {/* Mobile Menu Button - Hidden on Desktop */}
      <button type="button" className="-m-2.5 p-2.5 text-muted-foreground lg:hidden">
        <span className="sr-only">Ouvrir sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-border lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search */}
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Rechercher
          </label>
          <div className="flex w-full md:max-w-md items-center">
            <Search className="h-4 w-4 text-muted-foreground absolute left-3" />
            <input
              id="search-field"
              className="block h-9 w-full rounded-md border border-input bg-muted/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Rechercher équipement, OT, etc..."
              type="search"
              name="search"
            />
          </div>
        </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <button type="button" className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground relative group">
            <span className="sr-only">Voir notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-2.5 right-2 h-2 w-2 rounded-full bg-danger ring-2 ring-card" />
          </button>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="sr-only">Changer de thème</span>
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-warning" />
              ) : (
                <Moon className="h-5 w-5 fill-primary/10 text-primary" />
              )}
            </button>
          )}

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

          {/* Profile User Icon Placeholder */}
          <div className="hidden lg:flex items-center gap-x-4">
             <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs border border-primary/30">
               {session?.user?.name?.charAt(0) || "U"}
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}
