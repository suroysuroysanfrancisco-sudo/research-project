import { supabase } from "@/lib/supabaseClient";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
      >
        Logout
      </button>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <Link
          to="/admin/destinations"
          className="p-6 bg-card shadow rounded-lg"
        >
          <h2 className="text-xl font-bold">Manage Destinations</h2>
        </Link>
      </div>
    </div>
  );
}
