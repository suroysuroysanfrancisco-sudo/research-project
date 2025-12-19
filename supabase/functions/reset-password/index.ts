import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    const jwt = authHeader.replace("Bearer ", "");

    // 🔐 Identify caller
    const {
      data: { user },
    } = await supabase.auth.getUser(jwt);

    if (!user) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    // 🔐 Verify admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return new Response("Forbidden", { status: 403, headers: corsHeaders });
    }

    const { user_id, new_password } = await req.json();

    if (!user_id || !new_password) {
      return new Response("Missing fields", {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 🚫 Prevent self-reset
    if (user_id === user.id) {
      return new Response(
        "You cannot reset your own password here",
        { status: 400, headers: corsHeaders }
      );
    }

    // 🔑 Reset password
    const { error } = await supabase.auth.admin.updateUserById(user_id, {
      password: new_password,
    });

    if (error) {
      return new Response(error.message, {
        status: 400,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch {
    return new Response("Server error", { status: 500, headers: corsHeaders });
  }
});
