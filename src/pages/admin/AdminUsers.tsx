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

  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [resetingId, setResetingId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");

  async function deleteUser(id: string) {
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      toast("Deleting admin...");
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
      } else {
          toast.success("User deleted successfully");
          setUsers((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (err: any) {
      toast.error("System Error: " + err.message);
    } finally {
      setConfirmingDeleteId(null);
    }
  }

  async function resetPassword(userId: string) {
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      toast("Updating password...");
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
      } else {
        toast.success("Password reset successfully");
        setResetingId(null);
        setNewPassword("");
      }
    } catch (err: any) {
      toast.error("System Error: " + err.message);
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
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.email}</td>

                  <td className="p-3 flex items-center gap-2">
                    {resetingId === u.id ? (
                      <div className="flex gap-2">
                        <input
                          autoFocus
                          type="text"
                          placeholder="New password"
                          className="px-2 py-1 border rounded text-sm w-32"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          onClick={() => resetPassword(u.id)}
                          className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setResetingId(null);
                            setNewPassword("");
                          }}
                          className="bg-muted px-2 py-1 rounded text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : confirmingDeleteId === u.id ? (
                      <div className="flex gap-2">
                         <button
                          onClick={() => deleteUser(u.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold animate-pulse"
                        >
                          Confirm?
                        </button>
                        <button
                          onClick={() => setConfirmingDeleteId(null)}
                          className="bg-muted px-3 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setResetingId(u.id)}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded border border-blue-200 transition-colors text-sm font-medium"
                        >
                          Reset Password
                        </button>
                        
                        <button
                          onClick={() => setConfirmingDeleteId(u.id)}
                          className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded border border-red-200 transition-colors text-sm font-medium"
                        >
                          Delete
                        </button>
                      </>
                    )}
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
