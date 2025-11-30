import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { MapPin, Users, Camera } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: MapPin,
      title: "Hidden Paradise",
      description: "Camotes Island is a group of islands in the Camotes Sea, east of Cebu Island, in the Philippines.",
    },
    {
      icon: Users,
      title: "Local Community",
      description: "Experience authentic Filipino hospitality and immerse yourself in the local culture and traditions.",
    },
    {
      icon: Camera,
      title: "Immersive Tours",
      description: "Explore stunning destinations through our state-of-the-art 360° virtual tour technology.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-playfair text-foreground mb-6">
              About Camotes Island
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Discover why Camotes Island is one of the Philippines' best-kept secrets
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none mb-16"
          >
            <div className="bg-card p-8 rounded-lg shadow-medium">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Camotes Island is a pristine tropical paradise located in the Camotes Sea, east of Cebu in the Central Philippines.
                Known for its unspoiled natural beauty, crystal-clear waters, and warm hospitality, this hidden gem offers visitors
                an authentic island experience away from the crowds.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The island group consists of four municipalities: San Francisco, Poro, Tudela, and Pilar. Each offers unique
                attractions, from stunning white sand beaches and mystical caves to serene lakes and vibrant local markets.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Through our virtual tour platform, we aim to showcase the natural wonders of Camotes Island and inspire travelers
                to experience this paradise firsthand while promoting sustainable tourism practices that preserve its beauty
                for future generations.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-card p-6 rounded-lg shadow-medium text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-playfair text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
