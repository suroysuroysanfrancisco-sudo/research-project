import { useState } from "react";
import { Viewer360, Hotspot } from "@/components/Viewer360";
import { PanoramaImage } from "@/components/PanoramaGalleryManager";
import { ChevronLeft, Map } from "lucide-react";

interface PanoramaViewerProps {
  panoramas: PanoramaImage[];
  hotspots: Hotspot[];
  className?: string;
}

export const PanoramaViewer = ({
  panoramas,
  hotspots,
  className = "",
}: PanoramaViewerProps) => {
  const defaultPanorama = panoramas.find((p) => p.isDefault) || panoramas[0];
  const [currentPanoramaId, setCurrentPanoramaId] = useState(defaultPanorama?.id);
  const [history, setHistory] = useState<string[]>([defaultPanorama?.id].filter(Boolean));
  const [showMenu, setShowMenu] = useState(false);

  const currentPanorama = panoramas.find((p) => p.id === currentPanoramaId);
  const currentHotspots = hotspots.filter(
    (h) => h.position // Filter hotspots for current panorama if needed
  );

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (hotspot.type === "navigation") {
      const targetId = hotspot.targetPanoramaId;
      if (targetId && panoramas.find((p) => p.id === targetId)) {
        // Add current to history before navigating
        setHistory((prev) => [...prev, currentPanoramaId!]);
        setCurrentPanoramaId(targetId);
      } else if (hotspot.targetImageUrl) {
        // Backward compatibility: find panorama by URL
        const targetPano = panoramas.find((p) => p.url === hotspot.targetImageUrl);
        if (targetPano) {
          setHistory((prev) => [...prev, currentPanoramaId!]);
          setCurrentPanoramaId(targetPano.id);
        }
      }
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current
      const previousId = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentPanoramaId(previousId);
    }
  };

  const handleJumpTo = (panoramaId: string) => {
    setHistory((prev) => [...prev, currentPanoramaId!]);
    setCurrentPanoramaId(panoramaId);
    setShowMenu(false);
  };

  if (!currentPanorama) {
    return (
      <div className="w-full h-[70vh] bg-black rounded-lg flex items-center justify-center text-white">
        No panorama available
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Navigation Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {/* Back Button */}
        {history.length > 1 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-black/70 text-white rounded-lg hover:bg-black/90 backdrop-blur-sm transition-colors"
            title="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        )}

        {/* Panorama Menu */}
        {panoramas.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-black/70 text-white rounded-lg hover:bg-black/90 backdrop-blur-sm transition-colors"
              title="View all areas"
            >
              <Map className="w-5 h-5" />
              {currentPanorama.name}
            </button>

            {showMenu && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border overflow-hidden">
                <div className="p-2 border-b bg-gray-50 dark:bg-gray-900">
                  <p className="text-sm font-medium">Jump to Area</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {panoramas.map((pano) => (
                    <button
                      key={pano.id}
                      onClick={() => handleJumpTo(pano.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        pano.id === currentPanoramaId
                          ? "bg-primary/10 text-primary font-medium"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-8 bg-black rounded overflow-hidden flex-shrink-0">
                          <img
                            src={pano.url}
                            alt={pano.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span>{pano.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 360° Viewer */}
      <Viewer360
        imageUrl={currentPanorama.url}
        title={currentPanorama.name}
        hotspots={currentHotspots}
        onHotspotClick={handleHotspotClick}
        className={className}
      />
    </div>
  );
};
