import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { DestinationCard } from "@/components/DestinationCard";
import { motion } from "framer-motion";
import { destinations } from "@/data/destinations.js";
import { Helmet } from "react-helmet-async";


const Destinations = () => {

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Destinations | San Francisco - Discover Paradise in Cebu</title>
      </Helmet>
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
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
              Discover the breathtaking natural wonders that make San Francisco, Camotes a hidden paradise
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                title={destination.title}
                description={destination.shortDescription}
                image={destination.image}
                link={`/destinations/${destination.id}`}
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
