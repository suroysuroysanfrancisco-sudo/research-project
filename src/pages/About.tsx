import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { MapPin, Users, Camera } from "lucide-react";
import { useEffect, useState } from "react";
import aboutImage from "@/assets/sea-beach.jpg";
import { Helmet } from "react-helmet-async";

const About = () => {
  const [offsetY, setOffsetY] = useState(0);

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

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid lg:grid-cols-2 gap-12 items-center mb-16"
            >
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
              <div className="bg-card p-8 rounded-lg shadow-medium prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The town of{" "} <span className="text-primary font-semibold">San Francisco</span>,
                  is the largest and most vibrant municipality on the Camotes Islands, located east of Cebu in the Philippines. Known for its pristine white-sand beaches, turquoise waters, picturesque caves, and serene natural destinations, San Francisco combines tropical beauty with a laid-back, welcoming island atmosphere. It is the main tourism hub of Camotes and the gateway to many of the island’s best attractions.
                </p>

                <p className="text-muted-foreground leading-relaxed mb-4">
                  San Francisco offers a balance of adventure, relaxation, and local culture. Visitors will find cozy resorts, friendly communities, and untouched natural scenery. The town is known for its clean surroundings, largely due to the award-winning environmental initiative called Purok System, which promotes strong community cooperation in keeping the environment clean.
                </p>

                <p className="text-muted-foreground leading-relaxed mb-4">
                  The municipality of San Francisco is situated east of the main island of Cebu. It primarily occupies Pacijan Island and the smaller Tulang Island to the north. A Spanish-era causeway connects Pacijan to the nearby Poro Island. The total land area covers around 10,600 hectares.
                </p>

                <p className="text-muted-foreground leading-relaxed mb-4">
                  Expect quiet roads, coconut-lined landscapes, and a refreshing escape from city life.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  Through our virtual tour platform, we aim to highlight its natural
                  wonders and cultural charm while supporting sustainable tourism.
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
    </>
  );
};

export default About;
