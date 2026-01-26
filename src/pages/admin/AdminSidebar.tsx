import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded-lg mb-2 ${
      location.pathname === path
        ? "bg-primary text-white"
        : "text-foreground hover:bg-muted"
    }`;

  return (
    <div className="w-64 h-screen bg-card border-r shadow-lg fixed left-0 top-0 p-6 z-[100]">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      <nav>
        <Link className={linkClass("/admin")} to="/admin">Dashboard</Link>
        <Link className={linkClass("/admin/destinations")} to="/admin/destinations">Manage Destinations</Link>
        <Link className={linkClass("/admin/destinations/new")} to="/admin/destinations/new">Add Destination</Link>
        <hr className="my-4 opacity-30" />
        <Link className={linkClass("/admin/users")} to="/admin/users">Manage Admins</Link>
        <Link className={linkClass("/admin/users/new")} to="/admin/users/new">Register Admin</Link>
      </nav>
    </div>
  );
}
