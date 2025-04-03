"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, CreditCard, Settings, BarChart } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Students", href: "/dashboard/students", icon: Users },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900/80 backdrop-blur-sm h-full border-r border-gray-800">
      <div className="p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#025DFF] text-white"
                    : "text-gray-300 hover:bg-gray-800/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="geist-sans">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
