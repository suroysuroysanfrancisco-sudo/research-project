import { useEffect, useRef } from "react";
import { Viewer } from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";

interface Viewer360Props {
  imageUrl: string;
  title?: string;
  className?: string;
}

export const Viewer360 = ({
  imageUrl,
  title,
  className = "",
}: Viewer360Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    if (!containerRef.current || !imageUrl) return;
    
    viewerRef.current?.destroy();

    const raf = requestAnimationFrame(() => {
      viewerRef.current = new Viewer({
        container: containerRef.current!,
        panorama: imageUrl,
        caption: title ?? "",
        defaultZoomLvl: 0,
        touchmoveTwoFingers: true,
        navbar: ["autorotate", "zoom", "fullscreen"],
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [imageUrl, title]);

  return (
    <div
      ref={containerRef}
      className={`w-full bg-black rounded-lg overflow-hidden shadow-large ${className}`}
      style={{
        height: "70vh",
        minHeight: "400px",
      }}
    />
  );
};
