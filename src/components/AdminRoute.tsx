import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }: { children: any }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });
  }, []);

  if (user === null) return <div>Loading...</div>;

  return user ? children : <Navigate to="/admin/Login" />;
}
