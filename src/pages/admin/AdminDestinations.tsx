import { supabase } from "@/lib/supabaseClient";
import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("destinations").select("*");
    setDestinations(data || []);
  }

  async function handleDelete(id: string) {
    try {
      console.log("handleDelete initiated for:", id);
      
      const confirmed = window.confirm(
        "Are you sure you want to delete this destination? This action cannot be undone."
      );

      if (!confirmed) {
        toast("Delete cancelled by user");
        return;
      }

      toast("Database request sent...");
      setLoading(true);

      const { error } = await supabase
        .from("destinations")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("Failed to delete destination: " + error.message);
        console.error(error);
      } else {
        toast.success("Destination deleted successfully");
        setDestinations((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (err: any) {
      console.error("Critical error in handleDelete:", err);
      toast.error("System Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Destinations</h1>

        <Link
          to="/admin/destinations/new"
          className="inline-block bg-primary text-white px-4 py-2 rounded mb-6"
        >
          Add New Destination
        </Link>

        <div className="grid grid-cols-1 gap-4">
          {destinations.map((d) => (
            <div
              key={d.id}
              className="p-4 bg-card shadow rounded flex justify-between items-start"
            >
              {/* EDIT LINK */}
              <Link
                to={`/admin/destinations/edit/${d.id}`}
                className="flex-1"
              >
                <h2 className="text-xl font-semibold">{d.title}</h2>
                <p className="text-muted-foreground text-sm">
                  {d.short_description}
                </p>
              </Link>

              <div className="ml-4 flex items-center h-full relative z-50">
                <button
                  type="button"
                  onClick={() => {
                    toast("Delete button clicked");
                    handleDelete(d.id);
                  }}
                  disabled={loading}
                  className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded border border-red-200 transition-colors text-sm font-medium cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
