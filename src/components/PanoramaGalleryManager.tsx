import { useState } from "react";
import { Upload, X, Star, GripVertical } from "lucide-react";

export interface PanoramaImage {
  id: string;
  name: string;
  url: string;
  isDefault: boolean;
  order: number;
}

interface PanoramaGalleryManagerProps {
  images: PanoramaImage[];
  onChange: (images: PanoramaImage[]) => void;
  onUpload: (file: File) => Promise<string>; // Returns uploaded URL
}

export const PanoramaGalleryManager = ({
  images,
  onChange,
  onUpload,
}: PanoramaGalleryManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await onUpload(file);
      const newImage: PanoramaImage = {
        id: `pano-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        url,
        isDefault: images.length === 0, // First image is default
        order: images.length,
      };
      onChange([...images, newImage]);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSetDefault = (id: string) => {
    onChange(
      images.map((img) => ({
        ...img,
        isDefault: img.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this panorama?")) return;
    
    const filtered = images.filter((img) => img.id !== id);
    // If deleted image was default, make first image default
    if (filtered.length > 0 && !filtered.some((img) => img.isDefault)) {
      filtered[0].isDefault = true;
    }
    onChange(filtered);
  };

  const handleUpdateName = (id: string, name: string) => {
    onChange(
      images.map((img) => (img.id === id ? { ...img, name } : img))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">360° Panorama Gallery</h3>
        <label className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90">
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Add Panorama"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {images.length === 0 ? (
        <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
          <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No panoramas yet. Upload your first 360° image.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {images
            .sort((a, b) => a.order - b.order)
            .map((image) => (
              <div
                key={image.id}
                className="flex items-center gap-3 p-3 bg-card border rounded-lg"
              >
                {/* Drag handle */}
                <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />

                {/* Thumbnail */}
                <div className="w-24 h-16 bg-black rounded overflow-hidden flex-shrink-0">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name */}
                <div className="flex-1">
                  {editingId === image.id ? (
                    <input
                      type="text"
                      value={image.name}
                      onChange={(e) => handleUpdateName(image.id, e.target.value)}
                      onBlur={() => setEditingId(null)}
                      onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                      className="w-full px-2 py-1 border rounded"
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={() => setEditingId(image.id)}
                      className="font-medium cursor-pointer hover:text-primary"
                    >
                      {image.name}
                    </div>
                  )}
                  {image.isDefault && (
                    <span className="text-xs text-primary flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-current" />
                      Default panorama
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!image.isDefault && (
                    <button
                      onClick={() => handleSetDefault(image.id)}
                      className="p-2 hover:bg-secondary rounded"
                      title="Set as default"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded"
                    title="Delete"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Upload multiple 360° images to create a virtual tour. Users can navigate between
        panoramas using hotspots.
      </p>
    </div>
  );
};
