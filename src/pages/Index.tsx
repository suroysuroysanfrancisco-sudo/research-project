import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { DestinationCard } from "@/components/DestinationCard";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-camotes.jpg";
import santiagoBay from "@/assets/santiago-bay.jpg";
import timboCave from "@/assets/timubo-cave.jpg";
import lakeDanao from "@/assets/lake-danao.jpg";

const Index = () => {
  const destinations = [
    {
      title: "Santiago Bay",
      description: "Pristine white sand beach with crystal-clear turquoise waters, perfect for swimming and relaxation.",
      image: santiagoBay,
      link: "/destinations/santiago-bay",
    },
    {
      title: "Timubo Cave",
      description: "A mystical cave with a natural lagoon inside, featuring stunning stalactites and crystal-clear waters.",
      image: timboCave,
      link: "/destinations/timubo-cave",
    },
    {
      title: "Lake Danao",
      description: "A serene guitar-shaped lake surrounded by lush forest, offering kayaking and peaceful nature walks.",
      image: lakeDanao,
      link: "/destinations/lake-danao",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Camotes Island Paradise"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold font-playfair text-white mb-6"
          >
            Discover Paradise
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed"
          >
            Experience the pristine beaches, crystal caves, and natural wonders of Camotes Island
            through immersive virtual tours
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-6 shadow-large"
              onClick={() => document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Destinations
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-foreground font-semibold text-lg px-8 py-6 shadow-large"
              onClick={() => window.location.href = "/virtual-tours"}
            >
              Virtual Tours
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown
            size={40}
            className="text-white animate-bounce cursor-pointer"
            onClick={() => document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" })}
          />
        </motion.div>
      </section>

      {/* Featured Destinations */}
      <section id="destinations" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-playfair text-foreground mb-4">
              Featured Destinations
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the most breathtaking locations Camotes Island has to offer
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
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-ocean">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-playfair text-white mb-6">
              Ready to Explore?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Start your virtual journey through Camotes Island's most stunning locations
            </p>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-sand hover:text-foreground font-semibold text-lg px-8 py-6 shadow-large"
              onClick={() => window.location.href = "/virtual-tours"}
            >
              Start Virtual Tour
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
