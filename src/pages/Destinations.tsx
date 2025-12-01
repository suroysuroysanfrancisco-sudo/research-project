import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { DestinationCard } from "@/components/DestinationCard";
import { motion } from "framer-motion";
import santiagoBay from "@/assets/santiago-bay.jpg";
import timboCave from "@/assets/timubo-cave.jpg";
import lakeDanao from "@/assets/lake-danao.jpg";

const Destinations = () => {
  const destinations = [
    {
      title: "Santiago White Beach",
      description: "Pristine white sand beach with crystal-clear turquoise waters, perfect for swimming, snorkeling, and beach activities.",
      image: santiagoBay,
      link: "/destinations/santiago-bay",
    },
    {
      title: "Timubo Cave",
      description: "A mystical cave featuring a natural lagoon inside with stunning stalactites and crystal-clear waters for swimming.",
      image: timboCave,
      link: "/destinations/timubo-cave",
    },
    {
      title: "Lake Danao Park",
      description: "A serene guitar-shaped lake surrounded by lush forest, offering kayaking, paddle boarding, and peaceful nature walks.",
      image: lakeDanao,
      link: "/destinations/lake-danao",
    },
    {
      title: "Himensulan White Sand",
      description: "Pristine white sand beach with crystal-clear turquoise waters, perfect for swimming, snorkeling, and beach activities.",
      image: santiagoBay,
      link: "/destinations/santiago-bay",
    },
    {
      title: "Camotes Tourist Inn",
      description: "A mystical cave featuring a natural lagoon inside with stunning stalactites and crystal-clear waters for swimming.",
      image: timboCave,
      link: "/destinations/timubo-cave",
    },
    {
      title: "Mangodlong Rock Resort",
      description: "A serene guitar-shaped lake surrounded by lush forest, offering kayaking, paddle boarding, and peaceful nature walks.",
      image: lakeDanao,
      link: "/destinations/lake-danao",
    },
    {
      title: "Amazing Island Cave",
      description: "Pristine white sand beach with crystal-clear turquoise waters, perfect for swimming, snorkeling, and beach activities.",
      image: santiagoBay,
      link: "/destinations/santiago-bay",
    },
    {
      title: "Paraiso Cave",
      description: "A mystical cave featuring a natural lagoon inside with stunning stalactites and crystal-clear waters for swimming.",
      image: timboCave,
      link: "/destinations/timubo-cave",
    },
    {
      title: "Lizzies Cavern Cave",
      description: "A serene guitar-shaped lake surrounded by lush forest, offering kayaking, paddle boarding, and peaceful nature walks.",
      image: lakeDanao,
      link: "/destinations/lake-danao",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-playfair text-foreground mb-4">
              Explore Our Destinations
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the breathtaking natural wonders that make Camotes Island a hidden paradise
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <DestinationCard
                key={destination.title}
                {...destination}
                delay={index * 0.2}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Destinations;
