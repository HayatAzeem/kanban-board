import { useState, useRef, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Briefcase, LayoutDashboard, Settings, LogOut, Bell, Search, Sun, Moon } from "lucide-react";
import { Avatar } from "../components/ui/Avatar";
import { cn } from "../utils/cn";

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const displayName = user?.username || user?.email || "User";
  const initials = displayName.substring(0, 2).toUpperCase();

  const navigation = [
    { name: "Boards", href: "/", icon: LayoutDashboard },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-border bg-surface hidden md:flex flex-col">
        <div className="flex h-14 items-center px-6 border-b border-border">
          <Briefcase className="h-5 w-5 text-accent mr-3" />
          <span className="text-sm font-semibold text-textMain">JobTracker AI</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-surfaceHover text-textMain" : "text-textMuted hover:bg-surfaceHover hover:text-textMain"
                )}
              >
                <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="border-t border-border p-4">
          <div className="flex items-center">
            <Avatar initials={initials} />
            <div className="ml-3">
              <p className="text-xs font-medium text-textMain max-w-[140px] truncate">{displayName}</p>
            </div>
            <button onClick={logout} className="ml-auto text-textMuted hover:text-danger p-1 rounded-md hover:bg-surfaceHover transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-surface/50 backdrop-blur-md px-6">
          <div className="flex items-center flex-1">
            {/* Search Bar mockup */}
            <div className="relative w-64 hidden sm:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-textMuted" />
              </span>
              <input
                type="text"
                className="w-full rounded-md border border-border bg-background py-1.5 pl-10 pr-3 text-sm text-textMain placeholder:text-textMuted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Search..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 relative" ref={notificationsRef}>
            <button onClick={toggleTheme} className="text-textMuted hover:text-textMain relative p-1 rounded-md hover:bg-surfaceHover transition-colors">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button onClick={() => setShowNotifications(!showNotifications)} className="text-textMuted hover:text-textMain relative p-1 rounded-md hover:bg-surfaceHover transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent animate-pulse"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 rounded-xl border border-border bg-surface shadow-soft z-50 overflow-hidden animate-fade-in origin-top-right">
                <div className="px-4 py-3 border-b border-border bg-surfaceHover/50">
                  <h3 className="text-sm font-semibold text-textMain">Notifications</h3>
                </div>
                <div className="flex flex-col items-center justify-center p-8 text-center bg-background/50">
                  <img src="/empty_notifications.png" alt="No notifications" className="w-32 h-32 object-contain mb-4 opacity-90 drop-shadow-sm rounded-lg" />
                  <p className="text-sm font-medium text-textMain">No notifications</p>
                  <p className="text-xs text-textMuted mt-1">You're all caught up!</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Pages get injected here */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
