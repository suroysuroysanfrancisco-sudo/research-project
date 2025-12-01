import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { fetchDestinations } from "@/data/destinations"; // now uses Supabase
import townMap from "@/assets/san-francisco.png";
import { useEffect, useState } from "react";

const VirtualTours = () => {
  const [destinations, setDestinations] = useState<any[]>([]);

  // Load Supabase destinations on mount
  useEffect(() => {
    fetchDestinations().then((data) => setDestinations(data));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Virtual Tours | San Francisco - Discover Paradise in Cebu</title>
      </Helmet>

      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Page Title */}
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

          {/* Interactive Map Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full max-w-4xl mx-auto"
          >
            {/* Map Image */}
            <img
              src={townMap}
              alt="San Francisco Map"
              className="w-full rounded-lg shadow-xl"
            />

            {/* Dynamic Map Hotspots */}
            {destinations.map((spot) =>
              spot.hotspot?.top && spot.hotspot?.left ? (
                <button
                  key={spot.id}
                  onClick={() => (window.location.href = `/destinations/${spot.id}`)}
                  className="absolute bg-primary text-white px-3 py-1 rounded-full shadow-lg text-sm font-semibold hover:bg-primary/80 transition transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    top: spot.hotspot.top,
                    left: spot.hotspot.left,
                  }}
                >
                  {spot.title}
                </button>
              ) : null
            )}
          </motion.div>

          {/* Navigation Tips */}
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
