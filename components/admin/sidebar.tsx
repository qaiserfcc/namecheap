"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/products", label: "Products", icon: "📦" },
    { href: "/admin/orders", label: "Orders", icon: "🛍️" },
    { href: "/admin/users", label: "Users", icon: "👥" },
    { href: "/admin/upload", label: "Bulk Upload", icon: "📤" },
    { href: "/admin/analytics", label: "Analytics", icon: "📈" },
  ]

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen">
      <div className="p-6 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-3 rounded-lg transition ${
              pathname === link.href
                ? "bg-primary text-primary-foreground neon-glow-blue"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <span className="mr-2">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>
    </aside>
  )
}
