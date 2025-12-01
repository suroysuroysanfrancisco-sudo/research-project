import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { MapPin, Users, Camera } from "lucide-react";
import { useEffect, useState } from "react";
import aboutImage from "@/assets/sea-beach.jpg";
import { Helmet } from "react-helmet-async";

const About = () => {
  const [offsetY, setOffsetY] = useState(0);

  // Parallax scroll
  const handleScroll = () => {
    setOffsetY(window.scrollY * 0.3);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: MapPin,
      title: "Hidden Paradise",
      description:
        "The town of San Francisco is a peaceful tropical destination on Pacijan Island in the Camotes.",
    },
    {
      icon: Users,
      title: "Local Community",
      description:
        "Experience authentic Filipino hospitality and immerse yourself in the local culture and traditions.",
    },
    {
      icon: Camera,
      title: "Immersive Tours",
      description:
        "Explore stunning attractions through our state-of-the-art 360° virtual tour technology.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>About | San Francisco - Discover Paradise in Cebu</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="pt-32 pb-20 px-4">
          <div className="container mx-auto">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-6xl font-bold font-playfair text-foreground mb-6">
                About San Francisco
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Discover the natural beauty and warm culture of San Francisco, Camotes
              </p>
            </motion.div>

            {/* Image + Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid lg:grid-cols-2 gap-12 items-center mb-16"
            >
              {/* Image */}
              <div className="w-full h-[30rem] overflow-hidden rounded-lg shadow-medium group">
                <img
                  src={aboutImage}
                  alt="San Francisco, Camotes"
                  className="w-full h-full object-cover rounded-lg transition-transform duration-700 group-hover:scale-[1.15]"
                  style={{
                    transform: `translateY(${offsetY * 0.2}px) scale(1.1)`,
                    transition: "transform 0.2s ease-out",
                  }}
                />
              </div>

              {/* Text */}
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

            {/* Features */}
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
    </>
  );
};

export default About;
