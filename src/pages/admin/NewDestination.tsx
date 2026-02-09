import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/AdminLayout";
import { uploadImage } from "@/lib/uploadImage";
import townMap from "@/assets/san-francisco.png";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function NewDestination() {
  const navigate = useNavigate();

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
    thumbnail_url: "",
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);

  const handleThumbnailUpload = async (e: any) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      
      setUploading(true);
      const url = await uploadImage(file);
      setForm((prev: any) => ({ ...prev, thumbnail_url: url }));
      toast.success("Thumbnail uploaded!");
    } catch (err: any) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
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

  const handleImageUpload = async (e: any) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      toast("Uploading image...");
      setUploading(true);
      const url = await uploadImage(file);

      setForm((prev: any) => ({
        ...prev,
        image_url: url,
      }));

      toast.success("Image uploaded!");
    } catch (err: any) {
      console.error(err);
      toast.error("Image upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.id || !form.title) {
      toast.error("Please enter a title.");
      return;
    }

    // Allow saving if at least ONE image is provided, preferably thumbnail
    if (!form.image_url && !form.thumbnail_url) {
      toast.error("Please upload at least a cover image or 360 image.");
      return;
    }

    try {
      setSaving(true);
      toast("Saving destination...");
      console.log("Saving form data:", form);

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
          thumbnail_url: form.thumbnail_url,
        },
      ]);

      if (error) {
        toast.error("Database Error: " + error.message);
      } else {
        toast.success("Destination added successfully!");
        navigate("/admin/destinations");
      }
    } catch (err: any) {
      toast.error("System Error: " + err.message);
      console.error(err);
    } finally {
      setSaving(false);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="p-6 border rounded-lg bg-card">
          <label className="block mb-2 font-bold text-lg">Cover Image (Thumbnail)</label>
          <p className="text-sm text-muted-foreground mb-4">
            Displayed on homepage and cards. Standard 2D photo.
          </p>
          <input type="file" accept="image/*" onChange={handleThumbnailUpload} />
          {form.thumbnail_url && (
            <img
              src={form.thumbnail_url}
              className="w-full h-48 object-cover rounded-lg shadow mt-4"
              alt="Thumbnail Preview"
            />
          )}
        </div>

        <div className="p-6 border rounded-lg bg-card">
           <label className="block mb-2 font-bold text-lg">Legacy 360° Image</label>
           <p className="text-sm text-muted-foreground mb-4">
             Fallback panorama.
           </p>
           <input type="file" accept="image/*" onChange={handleImageUpload} />
           {form.image_url && (
             <img
               src={form.image_url}
               alt="preview"
               className="w-full h-48 rounded shadow mt-4"
             />
           )}
        </div>
      </div>

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
        placeholder="Paste Google Maps Embed URL or iframe code here"
        value={form.map_embed}
        onChange={(e) => {
          let val = e.target.value;
          if (val.includes("<iframe")) {
            const match = val.match(/src="([^"]+)"/);
            if (match && match[1]) {
              val = match[1];
              toast.success("Extracted URL from iframe code");
            }
          }
          setForm({ ...form, map_embed: val });
        }}
      />

      <button
        disabled={uploading || saving}
        className="bg-primary text-white px-6 py-3 rounded mt-6 shadow disabled:opacity-50"
        onClick={save}
      >
        {saving ? "Saving..." : uploading ? "Uploading Image..." : "Save Destination"}
      </button>
    </div>
    </AdminLayout>
  );
}
