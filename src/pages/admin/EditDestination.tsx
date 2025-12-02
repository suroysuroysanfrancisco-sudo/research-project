import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/AdminLayout";
import { uploadImage } from "@/lib/uploadImage";
import { useParams } from "react-router-dom";
import townMap from "@/assets/san-francisco.png";

export default function EditDestination() {
  const { id } = useParams();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setForm(data);
      setLoading(false);
    }

    load();
  }, [id]);

  if (loading || !form) return <p className="p-10 text-lg">Loading...</p>;

  const handleImageUpload = async (e: any) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);

      const url = await uploadImage(file);

      setForm((prev: any) => ({
        ...prev,
        image_url: url,
      }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const update = async () => {
    const { error } = await supabase
      .from("destinations")
      .update({
        title: form.title,
        short_description: form.short_description,
        long_description: form.long_description,
        address: form.address,
        map_embed: form.map_embed,
        hotspot_top: form.hotspot_top,
        hotspot_left: form.hotspot_left,
        image_url: form.image_url,
      })
      .eq("id", id);

    if (error) alert(error.message);
    else alert("Updated successfully!");
  };

  const handleHotspotDrag = (e: any) => {
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    let top = ((e.clientY - rect.top) / rect.height) * 100;
    let left = ((e.clientX - rect.left) / rect.width) * 100;

    top = Math.min(98, Math.max(2, top));
    left = Math.min(98, Math.max(2, left));

    setForm((prev: any) => ({
      ...prev,
      hotspot_top: `${top.toFixed(2)}%`,
      hotspot_left: `${left.toFixed(2)}%`,
    }));
  };

  return (
         <AdminLayout>
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Destination</h1>

      <div
        ref={mapRef}
        className="relative w-full max-w-2xl mb-10 mx-auto select-none"
      >
        <img src={townMap} className="w-full rounded shadow-lg" />

        <div
          draggable
          onDragEnd={handleHotspotDrag}
          className="absolute bg-primary text-white px-3 py-1 rounded-full cursor-move shadow-md text-sm font-semibold"
          style={{
            top: form.hotspot_top,
            left: form.hotspot_left,
            transform: "translate(-50%, -50%)",
          }}
        >
          Drag Me
        </div>
      </div>

      <label className="block mb-2 font-semibold">Destination Image</label>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {uploading && (
        <p className="text-sm text-muted-foreground">Uploading...</p>
      )}

      {form.image_url && (
        <img
          src={form.image_url}
          className="w-48 rounded-lg shadow mt-4"
          alt="Preview"
        />
      )}

      <label className="block mt-6 mb-2 font-semibold">Destination ID</label>
      <input
        readOnly
        value={form.id}
        className="input w-full mb-6 bg-muted cursor-not-allowed"
      />

      <label className="block mb-2 font-semibold">Title</label>
      <input
        className="input w-full mb-4"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <label className="block mb-2 font-semibold">Short Description</label>
      <textarea
        className="input w-full mb-4"
        value={form.short_description}
        onChange={(e) =>
          setForm({ ...form, short_description: e.target.value })
        }
      />

      <label className="block mb-2 font-semibold">Long Description</label>
      <textarea
        className="input w-full mb-4"
        value={form.long_description}
        onChange={(e) =>
          setForm({ ...form, long_description: e.target.value })
        }
      />

      <label className="block mb-2 font-semibold">Address</label>
      <input
        className="input w-full mb-4"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      <label className="block mb-2 font-semibold">Google Map Embed URL</label>
      <textarea
        className="input w-full mb-4"
        value={form.map_embed}
        onChange={(e) => setForm({ ...form, map_embed: e.target.value })}
      />

      <label className="block mb-2 font-semibold">Hotspot Top (%)</label>
      <input
        className="input w-full mb-4"
        value={form.hotspot_top}
        onChange={(e) => setForm({ ...form, hotspot_top: e.target.value })}
      />

      <label className="block mb-2 font-semibold">Hotspot Left (%)</label>
      <input
        className="input w-full mb-4"
        value={form.hotspot_left}
        onChange={(e) => setForm({ ...form, hotspot_left: e.target.value })}
      />

      <button
        className="bg-primary text-white px-6 py-3 rounded mt-4 shadow-md"
        onClick={update}
      >
        Save Changes
      </button>
    </div>
    </AdminLayout>
  );
}
