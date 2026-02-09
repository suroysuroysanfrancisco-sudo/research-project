import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/AdminLayout";
import { uploadImage } from "@/lib/uploadImage";
import { useParams } from "react-router-dom";
import townMap from "@/assets/san-francisco.png";
import { toast } from "sonner";
import { HotspotEditor } from "@/components/HotspotEditor";
import { Hotspot } from "@/components/Viewer360";
import { PanoramaGalleryManager, PanoramaImage } from "@/components/PanoramaGalleryManager";

export default function EditDestination() {
  const { id } = useParams();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [panoramas, setPanoramas] = useState<PanoramaImage[]>([]);

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
        toast.error("Failed to load destination");
        return;
      }

      setForm(data);
      // Load hotspots from database (parse JSONB)
      setHotspots(data.hotspots || []);
      // Load panoramas from database
      setPanoramas(data.panorama_images || []);
      setLoading(false);
    }

    load();
  }, [id]);

  if (loading || !form) return <p className="p-10 text-lg">Loading...</p>;

  const handleThumbnailUpload = async (e: any) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const url = await uploadImage(file);

      setForm((prev: any) => ({
        ...prev,
        thumbnail_url: url,
      }));
      toast.success("Thumbnail uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Thumbnail upload failed.");
    } finally {
      setUploading(false);
    }
  };

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
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed.");
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
        thumbnail_url: form.thumbnail_url, // Save thumbnail
        hotspots: hotspots,
        panorama_images: panoramas,
      })
      .eq("id", id);

    if (error) toast.error("Failed to update: " + error.message);
    else toast.success("Updated successfully!");
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
    <div className="p-10 max-w-6xl mx-auto">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="p-6 border rounded-lg bg-card">
          <label className="block mb-2 font-bold text-lg">Cover Image (Thumbnail)</label>
          <p className="text-sm text-muted-foreground mb-4">
            Displayed on destination cards and headers. Should be a standard 2D photo.
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
            Fallback panorama if no gallery images are added.
          </p>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {form.image_url && (
            <img
              src={form.image_url}
              className="w-full h-48 object-cover rounded-lg shadow mt-4"
              alt="Panorama Preview"
            />
          )}
        </div>
      </div>

      <label className="block mt-6 mb-2 font-semibold">Destination ID</label>
      <input
        readOnly
        value={form.id}
        className="px-4 py-2 input w-full mb-6 bg-muted cursor-not-allowed"
      />

      <label className="block mb-2 font-semibold">Title</label>
      <input
        className="px-4 py-2 input w-full mb-4"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
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

      <label className="block mb-2 font-semibold">Google Map Embed URL</label>
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

      <label className="block mb-2 font-semibold">Hotspot Top (%)</label>
      <input
        readOnly
        className="px-4 py-2 input w-full mb-4 bg-muted cursor-not-allowed"
        value={form.hotspot_top}
        onChange={(e) => setForm({ ...form, hotspot_top: e.target.value })}
      />

      <label className="block mb-2 font-semibold">Hotspot Left (%)</label>
      <input
        readOnly
        className="px-4 py-2 input w-full mb-4 bg-muted cursor-not-allowed"
        value={form.hotspot_left}
        onChange={(e) => setForm({ ...form, hotspot_left: e.target.value })}
      />

      {/* 360° Panorama Gallery Section */}
      <div className="mt-10 pt-10 border-t">
        <PanoramaGalleryManager
          images={panoramas}
          onChange={setPanoramas}
          onUpload={uploadImage}
        />
      </div>

      {/* 360° Hotspots Section */}
      <div className="mt-10 pt-10 border-t">
        <h2 className="text-2xl font-bold mb-4">360° Virtual Tour Hotspots</h2>
        <p className="text-muted-foreground mb-6">
          Add interactive hotspots to your 360° panorama images. Click on the viewer
          below to add navigation points or information markers.
        </p>

        {panoramas.length > 0 ? (
          <HotspotEditor
            imageUrl={panoramas.find(p => p.isDefault)?.url || panoramas[0]?.url}
            hotspots={hotspots}
            onChange={setHotspots}
            panoramas={panoramas}
          />
        ) : form.image_url ? (
          <HotspotEditor
            imageUrl={form.image_url}
            hotspots={hotspots}
            onChange={setHotspots}
          />
        ) : (
          <div className="p-8 bg-muted rounded-lg text-center text-muted-foreground">
            Please upload panorama images in the gallery above to add hotspots.
          </div>
        )}
      </div>

      <button
        className="bg-primary text-white px-6 py-3 rounded mt-8 shadow-md hover:bg-primary/90 transition-colors"
        onClick={update}
      >
        Save Changes
      </button>
    </div>
    </AdminLayout>
  );
}
