import { useState, useRef, useEffect } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { Hotspot } from "@/components/Viewer360";
import { X, Edit2, Trash2, Plus } from "lucide-react";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";

import { PanoramaImage } from "./PanoramaGalleryManager";

interface HotspotEditorProps {
  imageUrl: string;
  hotspots: Hotspot[];
  onChange: (hotspots: Hotspot[]) => void;
  panoramas?: PanoramaImage[]; // Available panoramas for navigation
}

export const HotspotEditor = ({
  imageUrl,
  hotspots,
  onChange,
  panoramas = [],
}: HotspotEditorProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [editingHotspot, setEditingHotspot] = useState<Hotspot | null>(null);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [tempPosition, setTempPosition] = useState<{ yaw: number; pitch: number } | null>(null);

  // Initialize viewer
  useEffect(() => {
    if (!containerRef.current || !imageUrl) return;

    viewerRef.current?.destroy();

    const raf = requestAnimationFrame(() => {
      try {
        const viewerConfig: any = {
          container: containerRef.current!,
          panorama: imageUrl,
          defaultZoomLvl: 0,
          touchmoveTwoFingers: true,
          navbar: ["zoom", "fullscreen"],
        };

        // Add markers plugin if hotspots exist
        // Filter hotspots for CURRENT image only
        const currentPano = panoramas.find(p => p.url === imageUrl);
        const currentPanoId = currentPano?.id;

        const visibleHotspots = hotspots.filter(h => {
             if (h.panoramaId) return h.panoramaId === currentPanoId;
             // If legacy (no ID), show it? Yes, for now so they don't disappear in editor
             return true; 
        });

        if (visibleHotspots.length > 0) {
          viewerConfig.plugins = [
            [
              MarkersPlugin,
              {
                markers: visibleHotspots.map((hotspot) => ({
                  id: hotspot.id,
                  position: { 
                    yaw: `${hotspot.position.yaw}deg`, 
                    pitch: `${hotspot.position.pitch}deg` 
                  },
                  html: `
                    <div class="hotspot-marker ${hotspot.type === "navigation" ? "hotspot-navigation" : "hotspot-info"}">
                      <div class="hotspot-pulse"></div>
                      <div class="hotspot-icon">
                        ${
                          hotspot.type === "navigation"
                            ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'
                            : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
                        }
                      </div>
                    </div>
                  `,
                  tooltip: hotspot.tooltip,
                  data: hotspot,
                })),
              },
            ],
          ];
        }

        viewerRef.current = new Viewer(viewerConfig);
        console.log(`HotspotEditor: Initialized viewer with ${hotspots.length} hotspots`);

        // Handle clicks to add new hotspots
        viewerRef.current.addEventListener("click", (e: any) => {
          console.log("Viewer clicked!", { isAddingMode, event: e });
          
          if (isAddingMode && e.data) {
            const yaw = Math.round((e.data.yaw * 180) / Math.PI);
            const pitch = Math.round((e.data.pitch * 180) / Math.PI);
            
            console.log("Adding hotspot at:", { yaw, pitch });

            // Find current panorama ID
            const currentPano = panoramas.find(p => p.url === imageUrl);
            const panoramaId = currentPano?.id;
            
            setTempPosition({ yaw, pitch });
            setEditingHotspot({
              id: `hotspot-${Date.now()}`,
              panoramaId: panoramaId, // Save the ID of the current panorama
              position: { yaw, pitch },
              tooltip: "",
              type: "navigation",
            });
            setIsAddingMode(false);
          }
        });

        // Handle marker clicks for editing
        if (hotspots.length > 0) {
          const markersPlugin = viewerRef.current.getPlugin(MarkersPlugin);
          if (markersPlugin) {
            markersPlugin.addEventListener("select-marker", ({ marker }: any) => {
              setEditingHotspot(marker.data as Hotspot);
            });
          }
        }
      } catch (error) {
        console.error("Failed to initialize viewer in HotspotEditor:", error);
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [imageUrl, hotspots, isAddingMode]);

  const handleSaveHotspot = () => {
    if (!editingHotspot) return;

    const existingIndex = hotspots.findIndex((h) => h.id === editingHotspot.id);
    let newHotspots: Hotspot[];

    // 1. Save the current hotspot
    if (existingIndex >= 0) {
      // Update existing
      newHotspots = [...hotspots];
      newHotspots[existingIndex] = editingHotspot;
    } else {
      // Add new
      newHotspots = [...hotspots, editingHotspot];
    }

    // 2. Optimization: Auto-create return hotspot if it's a navigation type
    if (
      editingHotspot.type === "navigation" && 
      editingHotspot.targetPanoramaId && 
      editingHotspot.panoramaId // Ensure we know where we are coming FROM
    ) {
      const targetPanoId = editingHotspot.targetPanoramaId;
      const currentPanoId = editingHotspot.panoramaId;
      
      // Check if a return hotspot already exists on the target panorama pointing back to current
      const hasReturn = newHotspots.some(
        h => h.panoramaId === targetPanoId && h.targetPanoramaId === currentPanoId
      );

      if (!hasReturn) {
        // Create return hotspot
        const currentPanoName = panoramas.find(p => p.id === currentPanoId)?.name || "Previous Area";
        
        const returnHotspot: Hotspot = {
          id: `hotspot-${Date.now()}-return`,
          panoramaId: targetPanoId, // Place it on the TARGET panorama
          targetPanoramaId: currentPanoId, // Point it back to CURRENT panorama
          type: "navigation",
          tooltip: `Return to ${currentPanoName}`,
          position: { yaw: 0, pitch: -10 }, // Default position (user must adjust)
          targetTitle: currentPanoName
        };

        newHotspots.push(returnHotspot);
        alert(`A return hotspot to "${currentPanoName}" has been created on the target panorama. Please switch to that panorama to position it correctly.`);
      }
    }

    onChange(newHotspots);
    setEditingHotspot(null);
    setTempPosition(null);
  };

  const handleDeleteHotspot = (id: string) => {
    if (confirm("Are you sure you want to delete this hotspot?")) {
      onChange(hotspots.filter((h) => h.id !== id));
      if (editingHotspot?.id === id) {
        setEditingHotspot(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
        <button
          onClick={() => setIsAddingMode(!isAddingMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isAddingMode
              ? "bg-primary text-white"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          <Plus className="w-4 h-4" />
          {isAddingMode ? "Click on viewer to add hotspot" : "Add Hotspot"}
        </button>
        <span className="text-sm text-muted-foreground">
          {hotspots.length} hotspot{hotspots.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* 360° Viewer */}
      <div className="relative">
        <div
          ref={containerRef}
          className={`w-full bg-black rounded-lg overflow-hidden shadow-lg ${
            isAddingMode ? "cursor-crosshair" : ""
          }`}
          style={{ height: "500px" }}
        />
        {isAddingMode && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium">
            Click anywhere to add a hotspot
          </div>
        )}
      </div>

      {/* Hotspot Configuration Form */}
      {editingHotspot && (
        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {hotspots.find((h) => h.id === editingHotspot.id)
                ? "Edit Hotspot"
                : "New Hotspot"}
            </h3>
            <button
              onClick={() => {
                setEditingHotspot(null);
                setTempPosition(null);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Position (read-only) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Yaw (horizontal)
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${editingHotspot.position.yaw}°`}
                  className="w-full px-3 py-2 bg-muted rounded border cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Pitch (vertical)
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${editingHotspot.position.pitch}°`}
                  className="w-full px-3 py-2 bg-muted rounded border cursor-not-allowed"
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={editingHotspot.type}
                onChange={(e) =>
                  setEditingHotspot({
                    ...editingHotspot,
                    type: e.target.value as "navigation" | "info",
                  })
                }
                className="w-full px-3 py-2 rounded border"
              >
                <option value="navigation">Navigation (go to another 360°)</option>
                <option value="info">Info (show information)</option>
              </select>
            </div>

            {/* Tooltip */}
            <div>
              <label className="block text-sm font-medium mb-1">Tooltip</label>
              <input
                type="text"
                value={editingHotspot.tooltip}
                onChange={(e) =>
                  setEditingHotspot({
                    ...editingHotspot,
                    tooltip: e.target.value,
                  })
                }
                placeholder="Text shown on hover"
                className="w-full px-3 py-2 rounded border"
              />
            </div>

            {/* Navigation-specific fields */}
            {editingHotspot.type === "navigation" && (
              <>
                {panoramas.length > 0 ? (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Navigate to Panorama
                    </label>
                    <select
                      value={editingHotspot.targetPanoramaId || ""}
                      onChange={(e) =>
                        setEditingHotspot({
                          ...editingHotspot,
                          targetPanoramaId: e.target.value,
                          targetTitle: panoramas.find(p => p.id === e.target.value)?.name,
                        })
                      }
                      className="w-full px-3 py-2 rounded border"
                    >
                      <option value="">Select a panorama...</option>
                      {panoramas.map((pano) => (
                        <option key={pano.id} value={pano.id}>
                          {pano.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Target Image URL
                      </label>
                      <input
                        type="text"
                        value={editingHotspot.targetImageUrl || ""}
                        onChange={(e) =>
                          setEditingHotspot({
                            ...editingHotspot,
                            targetImageUrl: e.target.value,
                          })
                        }
                        placeholder="URL of the 360° image to navigate to"
                        className="w-full px-3 py-2 rounded border"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Add panoramas in the gallery above to use dropdown selection
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Target Title
                      </label>
                      <input
                        type="text"
                        value={editingHotspot.targetTitle || ""}
                        onChange={(e) =>
                          setEditingHotspot({
                            ...editingHotspot,
                            targetTitle: e.target.value,
                          })
                        }
                        placeholder="Title of the target location"
                        className="w-full px-3 py-2 rounded border"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* Info-specific fields */}
            {editingHotspot.type === "info" && (
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={editingHotspot.content || ""}
                  onChange={(e) =>
                    setEditingHotspot({
                      ...editingHotspot,
                      content: e.target.value,
                    })
                  }
                  placeholder="Information to display when clicked"
                  rows={3}
                  className="w-full px-3 py-2 rounded border"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSaveHotspot}
                className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90"
              >
                {hotspots.find((h) => h.id === editingHotspot.id)
                  ? "Update Hotspot"
                  : "Add Hotspot"}
              </button>
              {hotspots.find((h) => h.id === editingHotspot.id) && (
                <button
                  onClick={() => handleDeleteHotspot(editingHotspot.id)}
                  className="px-4 py-2 rounded-lg font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hotspots List */}
      {hotspots.length > 0 && !editingHotspot && (
        <div className="p-4 bg-card rounded-lg border">
          <h4 className="font-semibold mb-3">Existing Hotspots</h4>
          <div className="space-y-2">
            {hotspots.map((hotspot) => (
              <div
                key={hotspot.id}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">{hotspot.tooltip || "Untitled"}</div>
                  <div className="text-sm text-muted-foreground">
                    {hotspot.type === "navigation" ? "📍 Navigation" : "ℹ️ Info"} •
                    Yaw: {hotspot.position.yaw}° • Pitch: {hotspot.position.pitch}°
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingHotspot(hotspot)}
                    className="p-2 hover:bg-secondary rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteHotspot(hotspot.id)}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .hotspot-marker {
          position: relative;
          width: 50px;
          height: 50px;
          cursor: pointer;
          transform: translate(-50%, -50%);
        }

        .hotspot-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 2s ease-out infinite;
        }

        .hotspot-navigation .hotspot-pulse {
          background: rgba(59, 130, 246, 0.3);
        }

        .hotspot-info .hotspot-pulse {
          background: rgba(16, 185, 129, 0.3);
        }

        .hotspot-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(-50%, -50%);
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .hotspot-navigation .hotspot-icon {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }

        .hotspot-info .hotspot-icon {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .hotspot-marker:hover .hotspot-icon {
          transform: translate(-50%, -50%) scale(1.2);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
