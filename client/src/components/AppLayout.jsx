import {
  BarChart3,
  BookOpen,
  Bot,
  FilePlus2,
  Inbox,
  LifeBuoy,
  LogOut,
  Menu,
  Sparkles,
  UserRoundCog,
  X
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { ThemeToggle } from "./ThemeToggle.jsx";

const baseLinks = [
  { to: "/app/chat", label: "Ask AI", icon: Bot },
  { to: "/app/new-ticket", label: "New Ticket", icon: FilePlus2 },
  { to: "/app/tickets", label: "My Tickets", icon: Inbox }
];

function getRoleLinks(role) {
  if (role === "admin") {
    return [
      { to: "/app/agent", label: "Agent Desk", icon: UserRoundCog },
      { to: "/app/admin/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/app/admin/kb", label: "Knowledge Base", icon: BookOpen }
    ];
  }

  if (role === "agent") {
    return [{ to: "/app/agent", label: "Agent Desk", icon: UserRoundCog }];
  }

  return [];
}

function Sidebar({ links, user, logout, onNavigate }) {
  return (
    <aside className="flex h-full flex-col border-r border-line bg-panel text-ink">
      <div className="flex h-16 items-center gap-3 border-b border-line px-5">
        <div className="grid size-10 place-items-center rounded-xl bg-brand text-white shadow-soft">
          <LifeBuoy size={21} />
        </div>

        <div>
          <p className="text-sm font-bold text-ink">ResolveIQ</p>
          <p className="text-xs text-muted">AI SupportOps Copilot</p>
        </div>
      </div>

      <div className="px-4 py-5">
        <div className="rounded-xl border border-line bg-soft p-4">
          <div className="flex items-center gap-2 text-brand">
            <Sparkles size={16} />
            <p className="text-xs font-bold uppercase tracking-wide">Workspace</p>
          </div>

          <p className="mt-2 text-sm font-semibold text-ink">Smart support console</p>

          <p className="mt-1 text-xs leading-5 text-muted">
            AI answers, ticket routing, and support analytics in one place.
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-brand text-white shadow-soft"
                  : "text-muted hover:bg-soft hover:text-ink"
              }`
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-4">
        <div className="mb-3 rounded-xl border border-line bg-soft p-3">
          <p className="text-sm font-semibold text-ink">{user?.name || "User"}</p>
          <p className="mt-0.5 text-xs capitalize text-muted">{user?.role || "member"}</p>
        </div>

        <button onClick={logout} className="btn-secondary w-full">
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export function AppLayout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const allLinks = [...baseLinks, ...getRoleLinks(user?.role)];

  return (
    <div className="min-h-screen bg-soft text-ink transition-colors">
      <div className="fixed inset-y-0 left-0 z-30 hidden w-72 lg:block">
        <Sidebar links={allLinks} user={user} logout={logout} />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-slate-950/60"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />

          <div className="relative h-full w-72 shadow-panel">
            <Sidebar
              links={allLinks}
              user={user}
              logout={logout}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-panel/85 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="focus-ring rounded-lg border border-line bg-panel p-2 lg:hidden"
              aria-label="Open menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div>
              <p className="text-sm font-bold text-ink">
                Welcome back, {user?.name?.split(" ")[0] || "there"}
              </p>
              <p className="text-xs capitalize text-muted">{user?.role || "member"} workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button onClick={logout} className="btn-secondary hidden sm:inline-flex">
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
