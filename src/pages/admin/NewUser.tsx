import { useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/AdminLayout";

export default function NewUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) return alert(error.message);

    alert("User created successfully!");
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Register New User</h1>

      <label className="block mb-2">Email</label>
      <input
        className="input w-full mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="block mb-2">Password</label>
      <input
        type="password"
        className="input w-full mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="bg-primary text-white px-6 py-2 rounded" onClick={register}>
        Create User
      </button>
    </AdminLayout>
  );
}
