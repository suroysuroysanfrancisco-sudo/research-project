import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/AdminLayout";
import { uploadImage } from "@/lib/uploadImage";
import townMap from "@/assets/san-francisco.png";
import { useNavigate } from "react-router-dom";

export default function NewDestination() {
  const navigate = useNavigate();

  // ---------------------------------------
  // SLUGIFY FUNCTION (Auto-generate ID)
  // ---------------------------------------
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const [form, setForm] = useState<any>({
    id: "",
    title: "",
    short_description: "",
    long_description: "",
    address: "",
    map_embed: "",
    hotspot_top: "50%",
    hotspot_left: "50%",
    image_url: "",
  });

  const [uploading, setUploading] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);

  // ---------------------------------------
  // IMAGE UPLOAD HANDLER
  // ---------------------------------------
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

      alert("Image uploaded!");
    } catch (err) {
      console.error(err);
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // ---------------------------------------
  // DRAG HOTSPOT ON MAP
  // ---------------------------------------
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

  // ---------------------------------------
  // SAVE NEW DESTINATION TO SUPABASE
  // ---------------------------------------
  const save = async () => {
    if (!form.id || !form.title) {
      alert("Please enter a title.");
      return;
    }

    if (!form.image_url) {
      alert("Please upload an image.");
      return;
    }

    const { error } = await supabase.from("destinations").insert([
      {
        id: form.id,
        title: form.title,
        short_description: form.short_description,
        long_description: form.long_description,
        address: form.address,
        map_embed: form.map_embed,
        hotspot_top: form.hotspot_top,
        hotspot_left: form.hotspot_left,
        image_url: form.image_url,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Destination added successfully!");
      navigate("/admin/destinations");
    }
  };

  return (
<AdminLayout>
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Destination</h1>

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
        <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
      )}

      {form.image_url && (
        <img
          src={form.image_url}
          alt="preview"
          className="w-48 rounded shadow mt-4"
        />
      )}

      <label className="block mt-6 mb-2 font-semibold">Generated ID</label>
      <input
        className="px-4 py-2 input w-full mb-4 bg-muted cursor-not-allowed"
        value={form.id}
        readOnly
      />

      <label className="block mb-2 font-semibold">Title</label>
      <input
        className="px-4 py-2 input w-full mb-4"
        value={form.title}
        onChange={(e) =>
          setForm({
            ...form,
            title: e.target.value,
            id: slugify(e.target.value),
          })
        }
      />

      <label className="block mb-2 font-semibold">Short Description</label>
      <textarea
        className="px-4 py-2 input w-full mb-4"
        value={form.short_description}
        onChange={(e) =>
          setForm({ ...form, short_description: e.target.value })
        }
      />

      <label className="block mb-2 font-semibold">Long Description</label>
      <textarea
        className="px-4 py-2 input w-full mb-4"
        value={form.long_description}
        onChange={(e) =>
          setForm({ ...form, long_description: e.target.value })
        }
      />

      <label className="block mb-2 font-semibold">Address</label>
      <input
        className="px-4 py-2 input w-full mb-4"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      <label className="block mb-2 font-semibold">Map Embed URL</label>
      <textarea
        className="px-4 py-2 input w-full mb-4"
        value={form.map_embed}
        onChange={(e) => setForm({ ...form, map_embed: e.target.value })}
      />

      <button
        disabled={uploading}
        className="bg-primary text-white px-6 py-3 rounded mt-6 shadow disabled:opacity-50"
        onClick={save}
      >
        {uploading ? "Uploading..." : "Save Destination"}
      </button>
    </div>
    </AdminLayout>
  );
}
