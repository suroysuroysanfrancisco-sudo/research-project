import { supabase } from "@/lib/supabaseClient";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";

export default function AdminDashboard() {
  
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <AdminLayout>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
        >
          Logout
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <Link
          to="/admin/destinations"
          className="p-6 bg-card shadow-medium rounded-lg border hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Manage Destinations</h2>
          <p className="text-muted-foreground mt-2">
            View, edit, and update all virtual tour locations.
          </p>
        </Link>

        <Link
          to="/admin/destinations/new"
          className="p-6 bg-card shadow-medium rounded-lg border hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Add Destination</h2>
          <p className="text-muted-foreground mt-2">
            Create a new virtual tour spot and set its map hotspot.
          </p>
        </Link>

        <Link
          to="/admin/users/new"
          className="p-6 bg-card shadow-medium rounded-lg border hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Register New Admin</h2>
          <p className="text-muted-foreground mt-2">
            Add additional admin accounts.
          </p>
        </Link>
      </div>
    </AdminLayout>
  );
}
