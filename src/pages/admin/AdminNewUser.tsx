import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminLayout from "@/components/AdminLayout";
import { toast } from "sonner";

export default function AdminNewUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"viewer" | "editor" | "admin">("admin");
  const [loading, setLoading] = useState(false);

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // 🔐 get current session (must be admin)
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (!session) {
      toast.error("You must be logged in as admin.");
      setLoading(false);
      return;
    }

    // 🚀 call Edge Function
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      toast.error("Failed to create user: " + err);
    } else {
      toast.success("User created successfully");
      setEmail("");
      setPassword("");
      setRole("admin");
    }

    setLoading(false);
  }

  return (
    <AdminLayout>
      <div className="max-w-md mx-auto bg-card p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Register New Admin</h1>

        <form onSubmit={handleCreateUser} className="space-y-4">
          <input
            type="email"
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
