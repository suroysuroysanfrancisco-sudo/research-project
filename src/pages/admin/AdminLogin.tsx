import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return setError(error.message);
    window.location.href = "/admin";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-primary text-white py-3 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
