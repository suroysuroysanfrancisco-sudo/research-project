import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Viewer360 } from "@/components/Viewer360";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

// Your destination data
const destinations = {
  "santiago-bay": {
    title: "Santiago Bay",
    description:
      "Pristine white sand beach with crystal-clear turquoise waters, perfect for swimming and relaxation.",
    address: "Santiago, San Francisco, Camotes Island, Cebu",
    image: "/santiago-bay.jpg", // 360° image here
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d...",
  },
  "timubo-cave": {
    title: "Timubo Cave",
    description:
      "A mystical cave with a natural lagoon and beautiful rock formations.",
    address: "Barangay Sonog, San Francisco, Camotes Island, Cebu",
    image: "/timubo-cave.jpg", // 360° image
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!...",
  },
  "lake-danao": {
    title: "Lake Danao",
    description:
      "A serene guitar-shaped lake surrounded by lush forest vegetation.",
    address: "Lake Danao Park, San Francisco, Camotes Island, Cebu",
    image: "/lake-danao.jpg",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!...",
  },
};

const DestinationSingle = () => {
  const { id } = useParams();
  const data = destinations[id];

  if (!data) return <div>Destination not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{data.title} | San Francisco - Discover Paradise in Cebu</title>
      </Helmet>

      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold font-playfair text-foreground mb-6 text-center"
          >
            {data.title}
          </motion.h1>

          <p className="text-lg text-muted-foreground text-center mb-10">
            {data.description}
          </p>

          {/* 360 Viewer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-lg p-6 shadow-medium mb-10"
          >
            <Viewer360 imageUrl={data.image} title={data.title} />
          </motion.div>

          {/* Address */}
          <div className="bg-muted/40 rounded-lg p-6 shadow-medium mb-10">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Address
            </h3>
            <p className="text-muted-foreground">{data.address}</p>
          </div>

          {/* Map */}
          <div className="rounded-lg overflow-hidden shadow-medium">
            <iframe
              src={data.mapEmbed}
              className="w-full h-[350px] rounded-lg"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DestinationSingle;
