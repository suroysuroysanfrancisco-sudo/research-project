import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { fetchDestinations } from "@/data/destinations";
import townMap from "@/assets/san-francisco.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VirtualTours = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDestinations().then((data) => setDestinations(data));
  }, []);

  // Close tooltip when clicking background
  const handleBackgroundClick = () => setActiveSpotId(null);

  return (
    <div className="min-h-screen bg-background" onClick={handleBackgroundClick}>
      <Helmet>
        <title>Virtual Tours | San Francisco - Discover Paradise in Cebu</title>
      </Helmet>

      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-playfair text-foreground mb-4">
              Virtual Tours
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select a location from the interactive map to explore its 360° virtual experience.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full max-w-4xl mx-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking map area
          >
            <img
              src={townMap}
              alt="San Francisco Map"
              className="w-full rounded-lg shadow-xl"
            />
            {destinations.map((spot) =>
              spot.hotspot?.top && spot.hotspot?.left ? (
                <div
                  key={spot.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    top: spot.hotspot.top,
                    left: spot.hotspot.left,
                  }}
                >
                  {/* Marker Circle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (activeSpotId === spot.id) {
                        navigate(`/destinations/${spot.id}`);
                      } else {
                        setActiveSpotId(spot.id);
                      }
                    }}
                    className={`
                      w-6 h-6 rounded-full border-2 border-white shadow-lg 
                      transition-transform duration-300 ease-out flex items-center justify-center
                      ${activeSpotId === spot.id ? "bg-primary scale-125 z-20" : "bg-primary hover:bg-primary/90 hover:scale-110 z-10"}
                    `}
                    aria-label={`View ${spot.title}`}
                  >
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </button>

                  {/* Tooltip (Visible on Hover OR Active) */}
                  <div 
                    className={`
                      absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 
                      bg-foreground/90 text-background text-sm font-medium rounded-lg 
                      whitespace-nowrap shadow-xl cursor-pointer transition-all duration-200
                      ${activeSpotId === spot.id ? "opacity-100 translate-y-0 visible z-30" : "opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible group-hover:z-30"}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/destinations/${spot.id}`);
                    }}
                  >
                    {spot.title}
                    {/* Triangle Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-foreground/90" />
                  </div>
                </div>
              ) : null
            )}
          </motion.div>
          <div className="bg-muted/50 rounded-lg p-6 mt-12 shadow-medium">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              How to Use the Virtual Map
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Click any hotspot on the map to open its 360° virtual tour</li>
              <li>• Each destination page contains the immersive 360° viewer</li>
              <li>• You can zoom, pan, and explore the view freely</li>
              <li>• Use fullscreen mode for the best experience</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VirtualTours;
