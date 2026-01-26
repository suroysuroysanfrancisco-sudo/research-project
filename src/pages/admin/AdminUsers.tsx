import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminLayout from "@/components/AdminLayout";
import { toast } from "sonner";

type Profile = {
  id: string;
  email: string;
  role: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, role")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  }

  async function updateRole(id: string, role: string) {
    await supabase.from("profiles").update({ role }).eq("id", id);
    loadUsers();
    toast.success("Role updated successfully");
  }

  async function deleteUser(id: string) {
    if (!window.confirm("Delete this user permanently?")) return;

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({ user_id: id }),
      }
    );

    if (!res.ok) {
        const text = await res.text();
        toast.error("Failed to delete user: " + text);
        console.error("Delete user error:", text);
    } else {
        toast.success("User deleted successfully");
        setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  }

  async function resetPassword(userId: string) {
    const newPassword = window.prompt("Enter new password for this admin:");
    if (!newPassword) return;

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          new_password: newPassword,
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      toast.error("Failed to reset password: " + text);
      console.error("Reset password error:", text);
    } else {
      toast.success("Password reset successfully");
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

        {loading ? (
          <p>Loading…</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-muted text-left">
                <th className="p-3">Email</th>
                <th className="p-3">Reset Password</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.email}</td>

                  <td className="p-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetPassword(u.id);
                      }}
                      className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded border border-blue-200 transition-colors text-sm font-medium mr-3"
                    >
                      Reset Password
                    </button>
                  </td>

                  <td className="p-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteUser(u.id);
                      }}
                      className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded border border-red-200 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
