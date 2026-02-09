import { useEffect, useRef, useState } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";

export interface Hotspot {
  id: string;
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
                    <div class="hotspot-marker ${hotspot.type === "navigation" ? "hotspot-navigation" : "hotspot-info"}">
                      <div class="hotspot-pulse"></div>
                      <div class="hotspot-icon">
                        ${
                          hotspot.type === "navigation"
                            ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'
                            : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
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
        console.log(`Viewer initialized with ${hotspots.length} hotspots`);

        // Handle marker clicks if hotspots exist
        if (hotspots.length > 0) {
          const markersPlugin = viewerRef.current.getPlugin(MarkersPlugin);
          if (markersPlugin) {
            markersPlugin.addEventListener("select-marker", ({ marker }: any) => {
              const hotspot = marker.data as Hotspot;

              if (hotspot.type === "navigation" && hotspot.targetImageUrl) {
                // Navigate to new panorama
                setCurrentImageUrl(hotspot.targetImageUrl);
                setCurrentTitle(hotspot.targetTitle || "");
              }

              // Call custom callback if provided
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
