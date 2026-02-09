import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { DestinationCard } from "@/components/DestinationCard";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import aboutImage from "@/assets/sea-beach.jpg";
import heroVideo from "@/assets/beach-waves.mp4";
import santiagoBay from "@/assets/santiago-bay.jpg";
import timboCave from "@/assets/timubo-cave.jpg";
import lakeDanao from "@/assets/lake-danao.jpg";
import { Helmet } from "react-helmet-async";
import { MapPin, Users, Camera } from "lucide-react";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Destination {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

const Index = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      // Simple fetch without ordering to match Destinations page
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .limit(3);

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      if (data) {
        console.log("Fetched destinations:", data);
        setDestinations(data.map(d => ({
          ...d,
          description: d.short_description || d.description,
          image: d.thumbnail_url || d.image_url, // Use thumbnail if available, else fallback
          link: `/destinations/${d.id}`
        })));
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
       <Helmet>
        <title>San Francisco - Discover Paradise in Cebu</title>
       </Helmet>
      <Navigation />
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          ></video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 mx-auto">
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
            Experience the pristine beaches, crystal caves, and natural wonders of the town of San Francisco, Camotes, through immersive virtual tours.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-primary hover:text-foreground text-primary-foreground font-semibold text-lg px-8 py-6 shadow-large"
              onClick={() => document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Our Destinations
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 text-primary border-white hover:bg-white hover:text-foreground font-semibold text-lg px-8 py-6 shadow-large"
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

      <section className="pt-10 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-playfair text-foreground mb-4">
              About San Francisco
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Discover the natural beauty and warm culture of San Francisco, Camotes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid lg:grid-cols-2 gap-12 items-center mb-16"
          >
            <div className="w-full h-[30rem] overflow-hidden rounded-lg shadow-medium group">
              <img
                src={aboutImage}
                alt="San Francisco, Camotes"
                className="w-full h-full object-cover rounded-lg transition-transform duration-700 group-hover:scale-[1.15]"
              />
            </div>
            <div className="bg-card p-8 rounded-lg shadow-medium prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                The town of{" "}
                <span className="text-primary font-semibold">San Francisco</span>,
                located on Pacijan Island in the Camotes Sea, is a serene tropical
                destination known for its pristine beaches, crystal-clear waters,
                and warm local hospitality.
              </p>

              <p className="text-muted-foreground leading-relaxed mb-4">
                As the largest and most vibrant municipality in the Camotes, it
                offers a rich mix of attractions—from beaches and caves to lakes,
                viewpoints, and local communities.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Through our virtual tour platform, we aim to highlight its natural
                wonders and cultural charm while supporting sustainable tourism.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      <section id="destinations" className="py-20 px-4">
        <div className="container mx-auto">
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
              Explore the most breathtaking locations San Francisco, Camotes has to offer
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.length > 0 ? (
              destinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id || index}
                  {...destination}
                  delay={index * 0.2}
                />
              ))
            ) : (
              !loading && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <p className="text-xl">No featured destinations yet.</p>
                  <p className="text-sm mt-2">Check back soon for new places to explore!</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>
      
      <section id="map" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold font-playfair text-foreground mb-8"
          >
            Explore the Map
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            Discover San Francisco’s landmarks, beaches, lakes, and caves through our interactive map.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-full drop-shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62736.24774738796!2d124.2873412525624!3d10.655904658210611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a8329e7c298aed%3A0x6260721f703d69a!2sSan%20Francisco%2C%20Cebu!5e0!3m2!1sen!2sph!4v1764552173539!5m2!1sen!2sph"
                className="w-full h-[450px] rounded-xl"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>
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
              Start your virtual journey through San Franciscom Camotes' stunning locations
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
