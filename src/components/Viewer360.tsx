import { useEffect, useRef } from "react";
import { Viewer } from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";

interface Viewer360Props {
  imageUrl: string;
  title?: string;
  className?: string; // ⭐ ADD THIS
}

export const Viewer360 = ({ imageUrl, title, className = "" }: Viewer360Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy any existing viewer
    viewerRef.current?.destroy();

    viewerRef.current = new Viewer({
      container: containerRef.current,
      panorama: imageUrl,
      caption: title ?? "",
      touchmoveTwoFingers: true,
      defaultZoomLvl: 0,
      navbar: ["autorotate", "zoom", "fullscreen"],
    });

    return () => {
      viewerRef.current?.destroy();
    };
  }, [imageUrl, title]);

  return (
    <div
      ref={containerRef}
      className={`w-full rounded-lg overflow-hidden shadow-large ${className}`}
    />
  );
};
