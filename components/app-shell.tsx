"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ImageIcon,
  FileTextIcon,
  DatabaseIcon,
  CodeIcon,
  ShieldIcon,
  LayoutDashboardIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "./theme-toggle";
import { useState } from "react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/image", label: "Image Converter", icon: ImageIcon },
  { href: "/pdf", label: "Images ↔ PDF", icon: FileTextIcon },
  { href: "/data", label: "Data Converter", icon: DatabaseIcon },
  { href: "/base64", label: "Base64 Tool", icon: CodeIcon },
  { href: "/metadata", label: "Metadata & Palette", icon: ShieldIcon },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex w-full lg:h-screen lg:overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-sidebar lg:sticky lg:top-0 lg:flex lg:h-screen lg:overflow-y-auto">
        <div className="flex h-16 items-center gap-2.5 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <FileTextIcon className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">Doc Guru</span>
        </div>
        <Separator />
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-sidebar-primary/10 text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary" />
                )}
                <item.icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    active ? "text-sidebar-primary" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3">
          <div className="flex items-center justify-between rounded-lg border border-sidebar-border bg-card p-3">
            <span className="text-xs font-medium text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main wrapper */}
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <FileTextIcon className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Doc Guru</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
              {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        {open && (
          <nav className="flex flex-col gap-1 border-b bg-background p-3 lg:hidden">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
