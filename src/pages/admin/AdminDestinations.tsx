import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("destinations").select("*");
    setDestinations(data || []);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Destinations</h1>

      <Link
        to="/admin/destinations/new"
        className="bg-primary text-white px-4 py-2 rounded"
      >
        Add New Destination
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-4">
        {destinations.map((d: any) => (
          <Link
            key={d.id}
            to={`/admin/destinations/edit/${d.id}`}
            className="p-4 bg-card shadow rounded"
          >
            <h2 className="text-xl font-semibold">{d.title}</h2>
            <p className="text-muted-foreground">{d.short_description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
