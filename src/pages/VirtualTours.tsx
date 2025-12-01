import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Viewer360 } from "@/components/Viewer360";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet-async";

const VirtualTours = () => {
  // For demo purposes, using regular images. Replace with actual 360° images
  const tours = [
    {
      id: "santiago",
      title: "Santiago Bay 360° Tour",
      description: "Experience the pristine white sand beach and crystal-clear waters",
      image: "/santiago-bay.jpg", // Replace with actual 360° image
    },
    {
      id: "timubo",
      title: "Timubo Cave 360° Tour",
      description: "Explore the mystical cave with its natural lagoon",
      image: "/timubo-cave.jpg", // Replace with actual 360° image
    },
    {
      id: "danao",
      title: "Lake Danao 360° Tour",
      description: "Navigate the serene guitar-shaped lake",
      image: "/lake-danao.jpg", // Replace with actual 360° image
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Virtual Tours | San Francisco - Discover Paradise in Cebu</title>
      </Helmet>
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
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
              Immerse yourself in 360° views of Camotes Island's most beautiful locations
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs defaultValue="santiago" className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-8 h-auto bg-muted p-1">
                {tours.map((tour) => (
                  <TabsTrigger
                    key={tour.id}
                    value={tour.id}
                    className="py-4 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
                  >
                    {tour.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tours.map((tour) => (
                <TabsContent key={tour.id} value={tour.id} className="space-y-6">
                  <div className="bg-card rounded-lg p-6 shadow-medium">
                    <h2 className="text-2xl font-bold font-playfair text-foreground mb-2">
                      {tour.title}
                    </h2>
                    <p className="text-muted-foreground mb-6">{tour.description}</p>
                    <Viewer360 imageUrl={tour.image} title={tour.title} />
                  </div>

                  <div className="bg-muted/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      How to Navigate
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Click and drag to look around the 360° view</li>
                      <li>• Use mouse wheel or pinch to zoom in and out</li>
                      <li>• Click the fullscreen button for immersive experience</li>
                      <li>• Use arrow keys for smooth navigation</li>
                    </ul>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VirtualTours;
