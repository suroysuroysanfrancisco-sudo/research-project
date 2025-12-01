import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [destinations, setDestinations] = useState([]);

  const loadData = async () => {
    const { data } = await supabase.from("destinations").select("*");
    setDestinations(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

      <a href="/admin/add" className="btn mb-6 inline-block">
        + Add Destination
      </a>

      <div className="grid gap-4">
        {destinations.map((d) => (
          <div key={d.id} className="bg-card p-4 rounded shadow flex justify-between">
            <div>
              <h2 className="font-bold text-xl">{d.title}</h2>
              <p>{d.short_description}</p>
            </div>

            <div>
              <a href={`/admin/edit/${d.id}`} className="btn mr-3">Edit</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
