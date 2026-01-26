/// <reference lib="deno.ns" />

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

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Unauthorized", {
        status: 401,
        headers: corsHeaders,
      });
    }

    const jwt = authHeader.replace("Bearer ", "");

    // 🔐 Identify caller
    const {
      data: { user },
    } = await supabase.auth.getUser(jwt);

    if (!user) {
      return new Response("Unauthorized", {
        status: 401,
        headers: corsHeaders,
      });
    }

    // 🔐 Check admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return new Response("Forbidden", {
        status: 403,
        headers: corsHeaders,
      });
    }

    const { user_id } = await req.json();
    if (!user_id) {
      return new Response("Missing user_id", {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 🚨 Prevent self-delete
    if (user_id === user.id) {
      return new Response("Cannot delete yourself", {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 🗑️ Delete auth user
    await supabase.auth.admin.deleteUser(user_id);

    // 🧹 Delete profile
    await supabase.from("profiles").delete().eq("id", user_id);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response("Server error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
