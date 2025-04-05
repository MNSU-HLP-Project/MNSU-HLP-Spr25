import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, BarChart2, Settings } from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
  },
  {
    title: "Classes",
    href: "/dashboard/classes",
    icon: "users",
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: "chart",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "settings",
  },
];

export function DashboardNav() {
  const location = useLocation();

  return (
    <nav className="grid items-start gap-2 px-2 py-4">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.href;

        return (
          <Link key={index} to={item.href}>
            <span
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent" : "transparent"
              )}
            >
              {item.icon === "dashboard" && <LayoutDashboard className="mr-2 h-4 w-4" />}
              {item.icon === "users" && <Users className="mr-2 h-4 w-4" />}
              {item.icon === "chart" && <BarChart2 className="mr-2 h-4 w-4" />}
              {item.icon === "settings" && <Settings className="mr-2 h-4 w-4" />}
              <span>{item.title}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
