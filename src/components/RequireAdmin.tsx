import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RequireAdmin({ children }: any) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/admin/login");
      } else {
        setChecking(false);
      }
    }

    checkAuth();
  }, [navigate]);

  if (checking) return <p className="p-10">Checking authentication...</p>;

  return children;
}
