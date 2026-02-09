import { useEffect, useRef, useState } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";

export interface Hotspot {
  id: string;
  panoramaId?: string; // ID of the panorama this hotspot belongs to
  position: { yaw: number; pitch: number }; // Position in degrees
  tooltip: string; // Hover text
  type: "navigation" | "info"; // Navigation changes panorama, info shows details
  // For navigation type:
  targetPanoramaId?: string; // ID of panorama to navigate to (NEW)
  targetImageUrl?: string; // URL of the 360° image to navigate to (DEPRECATED)
  targetTitle?: string; // Title of the target location
  // For info type:
  content?: string; // Information to display
}

interface Viewer360Props {
  imageUrl: string;
  title?: string;
  className?: string;
  hotspots?: Hotspot[]; // Array of clickable hotspots
  onHotspotClick?: (hotspot: Hotspot) => void; // Callback when hotspot is clicked
}

export const Viewer360 = ({
  imageUrl,
  title,
  className = "",
  hotspots = [],
  onHotspotClick,
}: Viewer360Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
  const [currentTitle, setCurrentTitle] = useState(title);

  useEffect(() => {
    if (!containerRef.current || !currentImageUrl) return;

    viewerRef.current?.destroy();

    const raf = requestAnimationFrame(() => {
      try {
        const viewerConfig: any = {
          container: containerRef.current!,
          panorama: currentImageUrl,
          caption: currentTitle ?? "",
          defaultZoomLvl: 0,
          touchmoveTwoFingers: true,
          navbar: ["autorotate", "zoom", "fullscreen"],
        };

        // Add MarkersPlugin with hotspots
        if (hotspots.length > 0) {
          viewerConfig.plugins = [
            [
              MarkersPlugin,
              {
                markers: hotspots.map((hotspot) => ({
                  id: hotspot.id,
                  position: { 
                    yaw: `${hotspot.position.yaw}deg`, 
                    pitch: `${hotspot.position.pitch}deg` 
                  },
                  html: `
                    <div class="hotspot-marker ${hotspot.type === "navigation" ? "hotspot-navigation" : "hotspot-info"}" data-id="${hotspot.id}">
                      <div class="hotspot-circle"></div>
                      <div class="hotspot-label">${hotspot.tooltip || hotspot.targetTitle || "View"}</div>
                    </div>
                  `,
                  tooltip: undefined, // We use custom label instead of default tooltip
                  data: hotspot,
                })),
              },
            ],
          ];
        }

        viewerRef.current = new Viewer(viewerConfig);
        console.log(`Viewer initialized with ${hotspots.length} hotspots`);

        // Handle marker clicks
        if (hotspots.length > 0) {
          const markersPlugin = viewerRef.current.getPlugin(MarkersPlugin);
          if (markersPlugin) {
            markersPlugin.addEventListener("select-marker", ({ marker }: any) => {
              const hotspot = marker.data as Hotspot;
              const markerEl = document.querySelector(`[data-id="${hotspot.id}"]`);
              
              // Mobile/Interaction Logic:
              // 1. If label is not visible, show it (and don't navigate yet)
              // 2. If label IS visible, navigate
              
              if (markerEl && !markerEl.classList.contains("visible-tooltip")) {
                // Hide all other tooltips
                document.querySelectorAll(".hotspot-marker").forEach(el => el.classList.remove("visible-tooltip"));
                // Show this one
                markerEl.classList.add("visible-tooltip");
                return; // Stop navigation
              }

              // Proceed to navigation
              if (hotspot.type === "navigation" && hotspot.targetPanoramaId) {
                // ... (Navigation handled handled by onHotspotClick primarily, but we can do it here too)
              }

              // Call custom callback
              if (onHotspotClick) {
                onHotspotClick(hotspot);
              }
            });
          }
        }
      } catch (error) {
        console.error("Failed to initialize 360 viewer:", error);
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [currentImageUrl, currentTitle, hotspots, onHotspotClick]);

  // Update when imageUrl prop changes
  useEffect(() => {
    setCurrentImageUrl(imageUrl);
    setCurrentTitle(title);
  }, [imageUrl, title]);

  return (
    <>
      <style>{`
        .hotspot-marker {
          position: relative;
          width: 40px;
          height: 40px;
          cursor: pointer;
          z-index: 100 !important;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hotspot-circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.3);
          transition: transform 0.2s;
        }

        .hotspot-navigation .hotspot-circle {
          background: #3b82f6; /* Blue for nav */
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
        }

        .hotspot-info .hotspot-circle {
          background: #10b981; /* Green for info */
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.3);
        }

        .hotspot-marker:hover .hotspot-circle,
        .hotspot-marker.visible-tooltip .hotspot-circle {
          transform: scale(1.2);
        }

        .hotspot-label {
          position: absolute;
          top: 30px; /* Below the circle */
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .hotspot-marker:hover .hotspot-label,
        .hotspot-marker.visible-tooltip .hotspot-label {
          opacity: 1;
        }

        /* Tooltip styling */
        .psv-tooltip {
          background: rgba(0, 0, 0, 0.85) !important;
          color: white !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
          font-size: 14px !important;
          backdrop-filter: blur(10px);
        }
      `}</style>
      <div
        ref={containerRef}
        className={`w-full bg-black rounded-lg overflow-hidden shadow-large ${className}`}
        style={{
          height: "70vh",
          minHeight: "400px",
        }}
      />
    </>
  );
};
